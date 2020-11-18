require('newrelic');
require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('./config/passport');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session); 
var jwt = require('jsonwebtoken');

var Usuario = require('./models/usuario');
var Token = require('./models/token');

var indexRouter = require('./routes/index');
var biciRouter = require('./routes/bicicletas');
var usuRouter = require('./routes/usuarios');
var tokenRouter = require('./routes/token');
var biciAPIRouter = require('./routes/api/bicicletas');
var usuAPIRouter = require('./routes/api/usuarios');
var authAPIRouter = require('./routes/api/auth');
var personAPIRouter = require('./routes/api/persona');

let store;
if(process.env.NODE_ENV === 'development'){
  store = new session.MemoryStore;
}else{
  store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
  });

  store.on('error',function (error) {
    assert.ifError(error);
    assert.ok(false);
  });
}

var app = express();

app.set('secretKey','jwt_pwd_¿¿?-?5*43');

app.use(session({
  cookie: {maxAge: 240 * 60 * 60 * 1000}, //10 días
  store: store,
  saveUninitialized: true,
  resave: 'true',
  secret: 'd!f7*df*s4red_bicicletas_ie*fhfy87d¡"'
}));

var mongoose = require('mongoose');
const usuario = require('./controllers/usuario');
const { assert } = require('console');

var mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error',console.error.bind(console,'MongoDB connection error: '));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login',function (req,res) {
  res.render('session/login');
});

app.post('/login',function (req,res,next){
  passport.authenticate('local',function (err,usuario,info) {
    if(err) return next(err);
    if(!usuario) return res.render('session/login',{info});
    req.logIn(usuario,function (err) {
      if(err) return next(err);
      return res.redirect('/');
    });
  })(req,res,next);
});

app.get('/logout',function (req,res) {
  req.logOut();
  res.redirect('/login');
});

app.get('/forgotPassword',function (req,res) {
  res.render('session/forgotPassword');
});

app.post('/forgotPassword',function (req,res) {
  Usuario.findOne({email:req.body.email},function (err,usuario) {
    if(!usuario) return res.render('session/forgotPassword',{info:{message:'No existe el email para un usuario existente'}});

    usuario.resetPassword(function (err) {
      if(err) return next(err);
      console.log('session/forgotPasswordMessage');
    });

    res.render('session/forgotPasswordMessage');
  })
});

app.get('/resetPassword/:token',function (req,res,next) {
  Token.findOne({token:req.params.token},function (err,token) {
    if(!token) return res.status(400).send({type:'not-verified',msg:'No existe un usuario asociado al token. Verifique que su token no haya expirado'});

    Usuario.findById(token._userId,function (err,usuario) {
      if(!usuario) return res.status(400).send({msg: 'No existe un usuario asociado al token.'});
      res.render('session/resetPassword',{errors:{},usuario:usuario});
    })
  });
});

app.post('/resetPassword',function (req,res) {
  if(req.body.password != req.body.confirm_password){
    res.render('session/resetPassword',{errors:{confirm_password:{message:'No coincide con el password ingresado'}},
    usuario: new Usuario({email:req.body.email})});
    return;
  }

  Usuario.findOne({email:req.body.email},function (err,usuario) {
    usuario.password = req.body.password;
    usuario.save(function (err) {
      if(err){
        res.render('session/resetPassword',{errors:err.errors,usuario:new Usuario({email:req.body.email})});
      }else{
        res.redirect('/login');
      }
    });
  });
});

app.use('/', indexRouter);
app.use('/bicicletas',loggedIn,biciRouter);
app.use('/usuarios',loggedIn,usuRouter);
app.use('/token', tokenRouter);
app.use('/api/bicicletas',validarUsuario,biciAPIRouter);
app.use('/api/usuarios', usuAPIRouter);
app.use('/api/auth', authAPIRouter);
app.use('/api/personas',personAPIRouter);

app.use('/privacy_policy',function (req,res) {
  res.sendFile('public/policy_privacy.html' , { root : __dirname});
});

app.use('/googlea3af8b7d8f543821',function (req,res) {
  res.sendFile('public/googlea3af8b7d8f543821.html' , { root : __dirname});
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/');
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function loggedIn(req,res,next) {
  if (req.user) {
    next();
  } else {
    console.log('user sin loguearse');
    res.redirect('/login');
  }
}

function validarUsuario(req,res,next) {
  jwt.verify(req.headers['x-access-token'],req.app.get('secretKey'),function (err,decoded) {
    if(err){
      res.json({status:"error",message: err.message,data:null});
    }else{
      req.body.userId = decoded.id;
      console.log('jwt verify: '+ decoded);
      next();
    }
  });
}

module.exports = app;
