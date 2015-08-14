'use strict';

var express = require('express');
var controller = require('./scoreboard.controller');

var router = express.Router();

router.get('/', controller.index);
// router.get('/:id', controller.show);
router.post('/', controller.create);
router.get('/initialsetup',auth.hasAdminRole('sec'),controller.setup);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;