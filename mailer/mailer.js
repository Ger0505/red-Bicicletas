var nodemailer = require('nodemailer');
const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'johan.wuckert@ethereal.email',
        pass: 'BppEXXhrBDjUkSVg7B'
    }
};

module.exports = nodemailer.createTransport(mailConfig);