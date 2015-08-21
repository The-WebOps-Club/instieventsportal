'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var ScorecardSchema = new Schema({
	hostelId : { type:Schema.Types.ObjectId, ref:'HostelSchema' , unique: true},
  	score : { type: Number,required:true,default:0}
  });

var HostelSchema = new Schema({
  name: {type: String,required : true, unique:true }
});

var ScoreboardSchema = new Schema({
  category: {type:String , required: true},
  scorecard: [ScorecardSchema]
});

var Scoreboard = mongoose.model('Scoreboard', ScoreboardSchema);
var Hostel= mongoose.model('Hostel', HostelSchema);
var Scorecard = mongoose.model('Scorecard', ScorecardSchema);

exports.Scoreboard = Scoreboard;
exports.Hostel = Hostel;
exports.Scorecard=Scorecard;