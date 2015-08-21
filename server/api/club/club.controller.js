'use strict';

var _ = require('lodash');
var ClubSchema = require('./club.model');

 // Get list of clubs
exports.index = function(req, res) {
  ClubSchema.Club.find(function (err, clubs) {
    if(err) { return handleError(res, err); }
    return res.json(200, clubs);
  });
};

// Get a single club
exports.show = function(req, res) {
  ClubSchema.Club.findById(req.params.id, function (err, club) {
    if(err) { return handleError(res, err); }
    if(!club) { return res.send(404); }
    return res.json(club);
  });
};

// Creates a new club in the DB.
exports.create = function(req, res) {
  console.log(req.body);
  req.body.category = req.user.role.category; 
  var query = { name : req.body.name , category : req.body.category };
  ClubSchema.Club.find(query, function (err , club) {
    if(err) { return handleError(res, err); }
    if( club.length < 1) {
      ClubSchema.Club.create( req.body, function (err, club) {
        if(err) { return handleError(res, err); }
        return res.json(201, club);
      });
    }
    else {
      return res.json(200, club[0]);
    }
  });
};

//ClubSchema.Subscribe to a club
exports.subscribe = function(req,res) {
  req.body.user = req.user;
  req.body.club = req.params.id;
  var query = { user : req.body.user , club : req.body.club};
  ClubSchema.Subscribe.find(query, function (err , subscribe) {
    if(err) { return handleError(res, err); }
    if( subscribe.length < 1) {
      ClubSchema.Subscribe.create( req.body, function (err, subscribe) {
        if(err) { return handleError(res, err); }
        return res.json(201, subscribe);
      });
    }
    else {
      return res.json(200, subscribe[0]);
    }
  });
};

//Unsubscribe from a club
exports.unsubscribe = function(req,res) {
  req.body.user = req.user;
  req.body.club = req.params.id;
  var query = { user : req.body.user , club : req.body.club};
  ClubSchema.Subscribe.find(query, function (err , subscribe) {
    if(err) { return handleError(res, err); }
    if( subscribe.length < 1) {
      return res.send(404);
    }
    else {
      subscribe[0].remove( function(err) {
        if (err) { return handleError(res, err); }
        return res.send(204);
      }); 
    }
  });
};

//Show list of subscribed clubs
exports.showSubscribe = function(req, res) {
  var query = { user : req.params.id };
  ClubSchema.Subscribe.find(query, function (err, subscribe) {
    if(err) { return handleError(res, err); }
    return res.json(200,subscribe);
  });
}

// Updates an existing club in the DB.
exports.update = function(req, res) {  req.body.updatedOn = Date()
  if(req.body._id) { delete req.body._id; }
  req.body.category = req.user.role.category;
  ClubSchema.Club.findById(req.params.id, function (err, club) {
    if (err) { return handleError(res, err); }
    if(!club) { return res.send(404); }
    if(req.user.role.category==club.category && (!(req.user.role.club) || req.user.role.club == club) )
    {
        req.body.category = req.user.role.category;
        var updated = _.merge(club, req.body);
        updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.json(200, club);     
        });      
    }
    else
     return res.json(403, {message: 'You are not authorised to update this club information'}); 
  });
};

// Updates conveners in the DB.
exports.updateConvenor = function(req, res) {
  ClubSchema.Club.findById(req.params.id, function (err, club) {
    if (err) { return handleError(res, err); }
    if(!club) { return res.send(404); }
    var updatedClub = new ClubSchema.Club(club);
    updatedClub.convenors = req.body;
    var response;
    ClubSchema.Club.update( { _id : req.params.id }, { convenors : req.body }, function(err, numberAffected, rawResponse) {
        if (err) { return handleError(res, err); }
        response = res.json(200, updatedClub);
        return response;
      });
    return response;
  });
};

// Deactivates a club
exports.changeStatus = function(req, res) {
  ClubSchema.Club.findById(req.params.id, function (err, club) {
    if(err) { return handleError(res, err); }
    if(!club) { return res.send(404); }
    var updatedClub = new ClubSchema.Club(club);
    updatedClub.active = !(club.active);
    ClubSchema.Club.update( {_id : req.params.id }, { active : !(club.active) }, function(err, numberAffected, rawResponse) {
      if(err) { return handleError(res, err); }
      return res.json(200, updatedClub);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
};
