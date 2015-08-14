'use strict';

var express = require('express');
var controller = require('./admin.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

// router.get('/', controller.index);
// router.get('/:id', controller.show);
// router.post('/', auth.isAdmin(), controller.create);
router.post('/convenor', auth.hasAdminRole('core'), controller.addConvenor);
router.post('/sec/:role', auth.hasAdminRole('sec'), controller.addSecRole);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;