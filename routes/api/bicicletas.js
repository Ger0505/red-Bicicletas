var express = require('express');
var router = express.Router();
var bicicletaController = require('../../controllers/api/bicicletaControllerAPI');

router.get('/',bicicletaController.bicicleta_list);
router.post('/create',bicicletaController.bicicleta_create);
router.post('/:id/update',bicicletaController.bicicleta_update);
router.delete('/:id/delete',bicicletaController.bicicleta_delete);

module.exports = router;