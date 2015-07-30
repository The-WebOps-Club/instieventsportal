'use strict';

var express = require('express');
var controller = require('./event.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.hasAdminRole('convenor'), controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', auth.hasAdminRole('convenor'), controller.destroy);

module.exports = router;