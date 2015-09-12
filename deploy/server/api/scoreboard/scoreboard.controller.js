'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');
var scoreboardss = require('./scoreboard.model');

var Hostels=["Alakanada","Brahmaputra","Cauvery","Ganga","Godavari","Jamuna","Krishna","Mahanadhi","Mandakini","Narmada","Pampa","Sabarmati","Saraswathi","Sarayu","Sharavati","Sindhu","Tamraparani","Tapti"];
var cat=["lit","tech","sports"];
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


// Get list of scoreboards
exports.index = function(req, res) {
  // scoreboardss.Scoreboard.find(function (err, scoreboards) {
  //   if(err) { return handleError(res, err); }
    // return res.status(200).json(scoreboards);
    //});
    scoreboardss.Scoreboard.find({})
  .lean()
  .populate({ path: 'scorecard' })
  .exec(function(err, docs) {

    var options = {
      path: 'scorecard.hostel',
      model: 'Hostel'
    };

    if (err) return res.json(500);
    scoreboardss.Scoreboard.populate(docs, options, function (err, projects) {
      res.json(projects);
    });
  });
};

exports.displayAllHostel = function( req, res){
  scoreboardss.Hostel.find({},function(err,hostel){
   if (err) { return handleError(res, err); }
   res.json(hostel); 
  });
}

// Updates an existing scoreboard in the DB.
exports.update = function(req, res) {
  var i,j;
  if(req.body._id) { delete req.body._id; }
  scoreboardss.Scoreboard.find({category : req.user.role.category }, function (err, scoreboard) {
    if (err) { return handleError(res, err); }
    if(!scoreboard) { return res.status(404).send('Not Found'); }
   for(j=0;j<req.body.results.length;j++) 
   {  
     for(i=0;i<Hostels.length;i++)
     {
      if(scoreboard[0].scorecard[i].hostel==req.body.results[j].hostel)
      {
        scoreboard[0].scorecard[i].score+=req.body.results[j].score;
      }
     }
   }
     var updated = scoreboard[0];
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      scoreboardss.Scoreboard.find({category : req.user.role.category})
  .lean()
  .populate({ path: 'scorecard' })
  .exec(function(err, docs) {

    var options = {
      path: 'scorecard.hostel',
      model: 'Hostel'
    };

    if (err) return res.json(500);
    scoreboardss.Scoreboard.populate(docs, options, function (err, scoreboard) {
      gcm("",302, scoreboard, getUsers());
      return res.status(200).json(scoreboard);
    });
  });
    });
  });

};

exports.setup = function(req, res) {
  var i,j=0;
 scoreboardss.Scoreboard.find(function (err,scorescore)
 { 
  if(scorescore.length<1)
  {
 mongoose.connection.db.dropCollection('scoreboards', function(err, result) {});
  for(i=0;i<Hostels.length;i++)
 {
   scoreboardss.Hostel.create({name:Hostels[i]}, function (err,hostel) {
    if(err) { return handleError(res, err); }
    // return res.status(201).json(hostel);
    scoreboardss.Scorecard.create({hostel:hostel._id}, function (err,scorecard) {
      j++;
    if(err) { return handleError(res, err); }
    // return res.status(201).json(hostel); 
     
  });
  });
 }
 

   while(j!=Hostels.length) {require('deasync').sleep(10);}
 
 j=2;
scoreboardss.Scorecard.find(function (err,scorecards){
  
   scoreboardss.Scoreboard.create({category : "lit" ,scorecard : scorecards},function (err,scoreboard){
   });
   scoreboardss.Scoreboard.create({category : "tech" ,scorecard : scorecards},function (err,scoreboard){
   });
   scoreboardss.Scoreboard.create({category : "sports" ,scorecard : scorecards},function (err,scoreboard){
    j=5;
   });

});


 res.status(201).json({'message':'The initialisation is over'});
 }
 else
  res.status(201).json({'message':'you have done initialisation before itself'});
});
};

exports.addNewHostel = function( req, res)
{
  var i;
  scoreboardss.Hostel.create({name : req.body.name},function ( err , hostel){
    if(err) { return handleError(res, err); }
      scoreboardss.Scorecard.create({hostel:hostel._id,score:0},function (err , scorecard){
         if(err) { return handleError(res, err); }
         scoreboardss.Scoreboard.find({},function (err , scoreboard){
          var j=0;
           for(i=0;i<scoreboard.length;i++)
           {
            scoreboard[i].scorecard.push(scorecard); 
            scoreboard[i].updatedOn=Date.now();     
           }
           
           for(i=0;i<scoreboard.length;i++)
           {
           scoreboard[i].save(/*function (err) {
      if (err) { return handleError(res, err); }}*/);   
         }
         }); 
      });
   return res.status(200).json({'message':'added hostel successfully'});
  });
}

function handleError(res, err) {
  return res.status(500).send(err);
}