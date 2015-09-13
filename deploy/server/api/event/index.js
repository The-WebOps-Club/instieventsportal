'use strict';

var express = require('express');
var controller = require('./event.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated() ,controller.index);
router.get('/:id',  auth.isAuthenticated() ,controller.show);
router.get('/:pageNumber/:limit',  auth.isAuthenticated() ,controller.limitedView);
router.post('/refresh',  auth.isAuthenticated() ,controller.refresh);
router.post('/', auth.hasAdminRole('convenor'), controller.create);
router.put('/:id', auth.hasAdminRole('convenor'), controller.update);
//router.patch('/:id', auth.hasAdminRole('convenor'), controller.update);
router.put('/result/:id', auth.hasAdminRole('convenor'), controller.addScore);
router.delete('/:id', auth.hasAdminRole('convenor'), controller.destroy);

module.exports = router;