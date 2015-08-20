'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var ScoreboardSchema = new Schema({
  category: String,
  scorecard:
  [
  	{
  		hostelId : { type:Schema.Types.ObjectId, ref:'HostelSchema', unique : true },
  		score : { type: String,required:true,default:0}
  	}
  ]
});

var HostelSchema = new Schema({
  name: { type: String, required : true }
});


module.exports = mongoose.model('Scoreboard', HostelSchema);
module.exports = mongoose.model('Hostel', ScoreboardSchema);
