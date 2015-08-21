'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ScoreboardSchema = new Schema({
	category: { type : String, required : true },
	scorecard: [ScorecardSchema]
});

var ScorecardSchema = new Schema({
	hostelId : { type : Schema.Types.ObjectId, ref : 'Hostel', required : true, unique : true },
	score : { type : Number, default : 0}
});

var HostelSchema = new Schema({
  name: { type: String, required : true }
});

var Scoreboard = mongoose.model('Scoreboard', ScoreboardSchema);
var Hostel = mongoose.model('Hostel', HostelSchema);
var Scorecard = mongoose.model('Scorecard', ScorecardSchema);

exports.Scoreboard = Scoreboard;
exports.Hostel = Hostel;
exports.Scorecard = Scorecard;
