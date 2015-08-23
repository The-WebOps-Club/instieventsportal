'use strict';

var express = require('express');
var controller = require('./admin.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

// router.get('/', controller.index);
// router.get('/:id', controller.show);
// router.post('/', auth.isAdmin(), controller.create);
router.post('/addConvenor', auth.hasAdminRole('core'), controller.addConvenor);
router.post('/sec/:role', auth.hasAdminRole('sec'), controller.addSecRole);
router.put('/:id',auth.hasAdminRole('sec'), controller.update);
router.put('/:id/password', auth.hasAdminRole('convenor'), controller.changePassword);
router.post('/forgotPassword', controller.forgotPassword);
router.post('/resetPassword/:token', controller.resetPassword);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;