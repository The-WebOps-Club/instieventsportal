'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');
// var scoreboardss.Hostel = require('./scoreboard.model');
var scoreboardss = require('./scoreboard.model');
var Hostels=["Tapti","Pampa","Mahanadhi","Mandakini","Sindhu","Ganga","Brahmaputra","Tamraparani","Godavari","Narmada","Saraswathi","Krishna","Cauvery","Tunga","Badra","Jamuna","Alakanada","Sharavati","Sarayu","Sabarmati"];
var cat=["lit","tech","sports"];
// Get list of scoreboards
exports.index = function(req, res) {
  scoreboardss.Scoreboard.find(function (err, scoreboards) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(scoreboards);
  });
};

// // Get a single scoreboard
// exports.show = function(req, res) {
//   scoreboardss.Scoreboard.findById(req.params.id, function (err, scoreboard) {
//     if(err) { return handleError(res, err); }
//     if(!scoreboard) { return res.status(404).send('Not Found'); }
//     return res.json(scoreboard);
//   });
// };


// // Creates a new scoreboard in the DB.
// exports.create = function(req, res) {
//   req.body.category = req.user.role.category;

//   var query = { category : req.body.category };
//   scoreboardss.Scoreboard.find(query, function (err , scoreboard) {
//     if(err) { return handleError(res, err); }
//     if( scoreboard.length < 1) {
//       scoreboardss.Scoreboard.create( req.body, function (err, scoreboard) {
//         if(err) { return handleError(res, err); }
//         return res.json(201, scoreboard);
//       });
//     }
//     else {
//       return res.json(200, scoreboard[0]);
//     }
//   });
// };

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
      if(scoreboard[0].scorecard[i].hostelId==req.body.results[j].hostelId)
      {
        scoreboard[0].scorecard[i].score+=req.body.results[j].score;
      }
     }
   }
     var updated = scoreboard[0];
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(scoreboard);
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
    scoreboardss.Scorecard.create({hostelId:hostel._id}, function (err,scorecard) {
      j++;
    if(err) { return handleError(res, err); }
    // return res.status(201).json(hostel); 
     
  });
  });

 }
// scoreboardss.Hostel.find(function (err,hostel) {
//     if(err) { return handleError(res, err); }
//      return res.status(201).json(hostel);
//   });
 
 
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


function handleError(res, err) {
  return res.status(500).send(err);
}