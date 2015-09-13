'use strict';

var _ = require('lodash');
var Event = require('./event.model');
var mongoosePaginate = require('mongoose-paginate');
var scoreboardss = require('../scoreboard/scoreboard.model');
var gcm = require('../../components/gcm-data');
var User = require('../user/user.model');

function getUsers()
{
  var regIds = [];
  var i,j,k=0;
  var len=-1;
  User.find(function (err, users) {
    len=users.length;
    for(i=0; i<users.length; i++) {
      for(j=0; j<users[i].deviceId.length; j++) {
        regIds[k++] = users[i].deviceId[j];
      }
    }
  });
  while(i!=len) { require('deasync').sleep(10); }
  return regIds; 
};

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
  var j=0;
  Event.findOne({ name : req.body.name },function (err ,event) {
    if(!event) {
    req.body.category = req.user.role.category;
    if (req.user.role.name == 'sec' || req.user.role.name == 'core' ){ req.body.isLitSocEvent = true; } 
    else { req.body.club = req.user.role.club }
    Event.create(req.body, function(err, event) {
      if(err) { return handleError(res, err); } 
       j=5;
      });}
    else
      return res.send(200, { message : "Event with same name already exists" ,event : event });
    while(j!=5){require('deasync').sleep(10);}
    Event.findOne({name : req.body.name})
    .lean()
    .exec(function(err,docs){
      var options = {
         path:'club',
         model:'Club'
      };
      if(err) return res.json(500);
      Event.populate(docs,options,function (err, projects){
        gcm("",101,projects,getUsers());
        console.log(0);
        return res.json(201,projects);
      });
    });
  });
};

exports.limitedView = function (req, res) {
  Event.paginate({}, {
  page: req.params.pageNumber, 
  limit: req.params.limit,
  sortBy: Event.time
},function(err, results, pageCount, itemCount){
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
    if(req.user.role.category==event.category && (!(req.user.role.club) || req.user.role.club == event.club) )
    {
      var updated = _.merge(event, req.body);
      if (req.body.coords != null) updated.coords = req.body.coords;
      updated.updatedOn = Date();
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        gcm("",201, event, getUsers());
        return res.json(200, event);
      });
    }
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

exports.addScore = function(req, res) {
  Event.findById(req.params.id) 
   .lean()
   .exec(function (err, event) {
    var options={
      path:'club',
      model:'Club'
    }
    var response;
    if(err) { return handleError(res, err); }
    if(!event) { return res.send(404); }
    var stop=0;
    Event.populate(event,options,function (err,updatedEvent){
    var query = { category : req.user.role.category };
    scoreboardss.Scoreboard.find(query, function (err, scoreboard) {
      if(err) { return handleError(res, err); }
      if(scoreboard.length < 1) { return res.send(404); }
      var i,j;
      for( i=0; i < updatedEvent.result.length; i++) {
        for( j=0; j < scoreboard[0].scorecard.length; j++) {
          if( scoreboard[0].scorecard[j].hostel == req.body.result[i].hostel ) {
            scoreboard[0].scorecard[j].score -= updatedEvent.result[i].score;
          }
        }
      }
      updatedEvent.result = req.body.result;
      Event.update( { _id : req.params.id }, { result : req.body.result }, function(err, numberAffected, rawResponse) {
        if (err) { return handleError(res, err); }
        response = res.json(200,updatedEvent);
      });
      for( i=0; i < updatedEvent.result.length; i++) {
        for( j=0; j < scoreboard[0].scorecard.length; j++) {
          if( scoreboard[0].scorecard[j].hostel == req.body.result[i].hostel ) {
            scoreboard[0].scorecard[j].score += req.body.result[i].score;
          }
        }
      }
      scoreboard[0].updatedOn = Date.now();
      var board = scoreboard[0];
      board.save(function (err) {
        if (err) { return handleError(res, err); }
        // stop=1;
  Event.find({ _id : req.params.id})
  .lean()
  .populate({ path: 'result' })
  .exec(function(err, docs) {

    var options = {
      path: 'result.hostel',
      model: 'Hostel'
    };
    console.log(0);
    if (err) return res.json(500);
    Event.populate(docs, options, function (err, scoreboard) {
      gcm("",301, scoreboard, getUsers());
      return res.status(200).json(scoreboard);
    });
  });
      });
    });
    // gcm("",301,updatedEvent,getUsers());
    // return response;
  });
  });
}
 
function handleError(res, err) {
  return res.send(500, err);
}