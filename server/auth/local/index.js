'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('user-local', function (err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);
    if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});

    var token = auth.signToken(user._id, user.role);
    res.json({token: token});
  })(req, res, next)
});

router.post('/admin/', function(req, res, next) {
  passport.authenticate('admin-local', function (err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);
    if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});
    var visibleUser = user;
    visibleUser.hashedPassword =  undefined;
    visibleUser.salt = undefined;
    var token = auth.signAdminToken(user._id, user.role);
    res.json({token: token, user : visibleUser});
  })(req, res, next)
});
module.exports = router;