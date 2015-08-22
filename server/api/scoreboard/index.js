'use strict';

var express = require('express');
var controller = require('./scoreboard.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/',auth.hasAdminRole('sec'), controller.index);
// router.get('/:id', controller.show);
// router.post('/',auth.hasAdminRole('sec'), controller.create);
router.get('/initialsetup',auth.hasAdminRole('sec'),controller.setup);
router.put('/',auth.hasAdminRole('sec'), controller.update);


module.exports = router;