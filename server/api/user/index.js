'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/',controller.index);
router.delete('/:id',auth.hasRole('admin'),controller.destroy);
router.get('/me',auth.isAuthenticated(), controller.changePassword);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id',controller.update);
router.get('/:id',auth.isAuthenticated(), controller.show);
router.post('/',controller.create);

module.exports = router;
