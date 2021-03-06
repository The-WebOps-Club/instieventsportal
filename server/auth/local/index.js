'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var User=require('../../api/user/user.model');
var jwt = require('jsonwebtoken');
var config = require('../../config/environment');
var router = express.Router();
var ClubSchema = require('../../api/club/club.model');

var validationError = function(res, err) {
  return res.json(422, err);
};

router.post('/mobile', function(req, res, next) {
  passport.authenticate('user-local', function (err, user, info) {
    var error = err || info;
     if (error) {
      console.log(error);
      if (error.error == 404){
        user = new User(req.body);
         user.provider = 'local';
         user.role = 'user';
         user.save(function(err, user) {
        if (err) {console.log(err); return validationError(res, err); };
      });
      }
      else
      return res.json(401, error);
    }
    
    var token = auth.signToken(user._id, user.role);
    var i,j;
  ClubSchema.Club.find(function (err, clubs) {
    ClubSchema.Subscribe.find(function (err, subscribe){
      for(i=0;i<clubs.length;i++)
      {
        for(j=0;j<subscribe.length;j++)
        {
          
          if(subscribe[j].club+'1'==clubs[i]._id+'1' && subscribe[j].user +'1'== user._id+'1')
           { clubs[i].isSubscribed=true; 
              console.log(clubs[i].isSubscribed);}
        }
      }
       res.json(200,{ token: token, user:user ,clubs : clubs});
    });    
  });
  })(req, res, next)
});

router.post('/', function(req, res, next) {
  passport.authenticate('user-local', function (err, user, info) {
    var error = err || info;
     if (error) {
      if (error.error == 404){
        user = new User(req.body);
       user.provider = 'local';
       user.role = 'user';
       user.save(function(err, user) {
        if (err) return validationError(res, err);
      });
      }
      else
      return res.json(401, error);
    }
    console.log(user.hostel);
    console.log(user.name);
    if(user.hostel==undefined||user.name==undefined)
    {
      console.log(0);
      res.json(404,{message:"either hostel or name field is missing"});
    }
    else
    {
  var token = auth.signToken(user._id, user.role);
  res.json(200,{ token: token, user:user});
    }
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