'use strict';

var express = require('express');
var controller = require('./event.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('user'),controller.index);
router.get('/:id', auth.hasRole('user'),controller.show);
router.post('/', auth.hasAdminRole('convenor'), controller.create);
router.put('/:id', auth.hasAdminRole('convenor'), controller.update);
router.patch('/:id', auth.hasAdminRole('convenor'), controller.update);
router.delete('/:id', auth.hasAdminRole('convenor'), controller.destroy);

module.exports = router;