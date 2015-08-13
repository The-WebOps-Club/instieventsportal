'use strict';

var _ = require('lodash');
var Event = require('./event.model');
var mongoosePaginate = require('mongoose-paginate');

// Get list of events
exports.index = function(req, res) {
  Event.find(function (err, events) {
    if(err) { return handleError(res, err); }
    return res.json(200, events);
  })
  .populate('club', 'name');
  ;
};

exports.refresh = function(req,res) {
  Event.find({updatedOn:{$gt: req.body.time}}, function(err,events){
    if(err) { return handleError(res,err); }
    return res.json(200,events);
  })
  .populate('club', 'name');
  ;
};

// Get a single event
exports.show = function(req, res) {
  Event.findById(req.params.id, function (err, event) {
    if(err) { return handleError(res, err); }
    if(!event) { return res.send(404); }
    return res.json(event);
  });
};

// Creates a new event in the DB.
exports.create = function(req, res) {
  req.body.category = req.user.role.category;
  if (req.user.role.name == 'sec'){ req.body.isLitSocEvent = true; } 
  else { req.body.club = req.user.role.club }
  Event.create(req.body, function(err, event) {
    if(err) { return handleError(res, err); }
    return res.json(201, event);
  });
};

exports.limitedView = function (req, res) {
  Event.paginate({}, {
  page: req.params.pageNumber, 
  limit: req.params.limit,
  sortBy: Event.time
},function(err, results, pageCount, itemCount){
  console.log(results);
  return res.json(200,results);
} );
}

// Updates an existing event in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  req.body.category = req.user.role.category;
  Event.findById(req.params.id, function (err, event) {
    if (err) { return handleError(res, err); }
    if(!event) { return res.send(404); }
    var updated = _.merge(event, req.body);
    if (req.body.coords != null) updated.coords = req.body.coords;
    updated.updatedOn = Date();
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, event);
    });
  });
};

// Deletes a event from the DB.
exports.destroy = function(req, res) {
  Event.findById(req.params.id, function (err, event) {
    if(err) { return handleError(res, err); }
    if(!event) { return res.send(404); }
    event.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}