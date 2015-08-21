'use strict';

var express = require('express');
var controller = require('./scoreboard.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/', controller.index);
// router.get('/:id', controller.show);
// router.post('/',auth.hasAdminRole('sec'), controller.create);
router.get('/initialsetup',auth.hasAdminRole('sec'),controller.setup);
// router.get('/initialsetupFinal',auth.hasAdminRole('sec'),controller.setupFinal);
router.put('/',auth.hasAdminRole('sec'), controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;