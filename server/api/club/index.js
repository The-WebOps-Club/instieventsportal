'use strict';

var express = require('express');
var controller = require('./club.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/', auth.hasAdminRole('convenor'), controller.index);
// router.get('/:id', controller.show);
router.post('/', auth.hasAdminRole('sec'), controller.create);
router.post('/convenor/:id', auth.hasAdminRole('convenor'), controller.updateConvenor);
router.put('/:id', auth.hasAdminRole('convenor'), controller.update);
router.get('/subscribe/:id', auth.isAuthenticated(), controller.subscribe);
router.get('/unsubscribe/:id', auth.isAuthenticated(), controller.unsubscribe);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;