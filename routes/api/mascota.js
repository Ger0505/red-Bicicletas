var express = require('express');
var router = express.Router();
var mascotaController = require('../../controllers/api/mascotaControllerAPI');

router.get('/',mascotaController.mascotas_list);
router.get('/:code',mascotaController.mascota_get);
router.post('/create',mascotaController.mascota_create);
router.post('/:code/update',mascotaController.mascota_update);
router.delete('/:code/delete',mascotaController.mascota_delete);
module.exports = router;