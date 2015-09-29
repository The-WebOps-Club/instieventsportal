'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var gcm = require('node-gcm');
var Event = require('../../api/event/event.model');
var scoreboardss= require('../../api/scoreboard/scoreboard.model');
var Clubs = require('../../api/club/club.model');
//var mailer=require('../../components/mailer')
var gcm = require('../../components/gcm');


var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
    //mailer('insti','check','parthu45@gmail.com',req.params.id);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session);

    res.json({ token: token,user: user });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.user._id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};


exports.refresh = function(req,res) {
  Clubs.Club.find({updatedOn:{$gt: req.body.time}}, function(err,clubs){
    if(err) { return handleError(res,err); }
    
    scoreboardss.Scoreboard.find({updatedOn:{$gt: req.body.time}})
    .lean()
    .populate({ path: 'scorecard' })
    .exec(function(err, docs) {

      var options = {
        path: 'scorecard.hostel',
        model: 'Hostel'
      };

      if (err) return res.json(500);
      scoreboardss.Scoreboard.populate(docs, options, function (err, projects) {
      
      Event.find({updatedOn:{$gt: req.body.time}})
      .lean()
      // .populate({ path: 'club' })
      .exec(function(err, docs) {

        var options = [{
          path: 'club',
          model: 'Club'
        }, {
          path: 'result.hostel',
          model: 'Hostel'
        }];

        if (err) return res.json(500);
        scoreboardss.Scoreboard.populate(docs, options, function (err, events) {
          
          return res.json(200,{events:events,clubs:clubs,scoreboard:projects})
        });
      });
        });
    });
  
  });  
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

// Updates an existing user in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  User.findById(req.params.id, function (err, user) {
    if (err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    var updated = _.merge(user, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, user);
    });
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

exports.gcmRegister = function(req, res) {
  User.findById(req.user._id, function (err, user) {
    if (err) { return handleError(res, err); }
    if (!user) { res.status(404).json({message: "User does not exist"}); }
    if(!req.body.deviceId) {res.status(401).json({message: "No deviceId in request"}); }
    else{
      if(req.body.oldId) {
        if( user.deviceId.indexOf(req.body.oldId) > -1)
          user.deviceId.splice(user.deviceId.indexOf(req.body.oldId), 1);
      }
      if( user.deviceId.indexOf(req.body.deviceId) === -1)
      user.deviceId.push(req.body.deviceId);
      user.updatedOn = Date.now();
      user.save(function (err) {
        if(err) { return handleError(res, err); }
        res.status(200).json({message: "Successful"}); 
      });
    }
  })
}

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

function handleError(res, err) {
  return res.send(500, err);
};
