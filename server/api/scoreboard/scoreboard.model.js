'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HostelSchema = new Schema({
  name: {type: String,required : true, unique: true}
});


var ScoreboardSchema = new Schema({
  category: String,
  scorecard:
  [
  	hostelId : { type:Schema.Types.ObjectId, ref:'HostelSchema', unique : true },
  	score : { type: String,required:true,default:0}
  ]
});

module.exports = mongoose.model('Hostel', HostelSchema);
module.exports = mongoose.model('Scoreboard', ScoreboardSchema);
