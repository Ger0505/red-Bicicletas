var express = require('express');
var router = express.Router();
var personaController = require('../../controllers/api/personaControllerAPI');

router.get('/',personaController.personas_list);
router.post('/session', personaController.persona_session);
router.post('/create',personaController.persona_create);
router.post('/:code/update',personaController.persona_update);
router.delete('/:code/delete',personaController.persona_delete);
module.exports = router;