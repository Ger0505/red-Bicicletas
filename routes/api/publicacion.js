var express = require('express');
var router = express.Router();
var publicacionController = require('../../controllers/api/publicacionControllerAPI');

router.get('/:tipo',publicacionController.publicacions_list);
router.get('/:code', publicacionController.publicacion_get);
router.get('/:code/comments', publicacionController.publicacion_comments);
router.post('/create',publicacionController.publicacion_create);
router.post('/addcomment', publicacionController.publicacion_addcomment);
router.delete('/:code/delete',publicacionController.publicacion_delete);
module.exports = router;