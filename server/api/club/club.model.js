'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ConvenorSchema = new Schema({
  name: { type : String, required : true },
  email: { type : String, required: true },
  phoneNumber: { type : String, required : true }
});

var SubscriptionSchema = new Schema({
  club : { type : Schema.Types.ObjectId, ref : 'Club', required : true },
  user : { type : Schema.Types.ObjectId, ref : 'User' }
});

var ClubSchema = new Schema({
  name: { type : String, required : true },
  convenors: [ConvenorSchema],
  description: { type : String },
  category: { type : String, required : true },
  updatedOn: { type: Date, default : Date() },
  createdOn: { type: Date, default : Date() },
  active: { type : Boolean, default : true },
  isSubscribed: { type : Boolean, default : false }
});

var Club = mongoose.model('Club', ClubSchema);
var Subscribe = mongoose.model('Subscribe', SubscriptionSchema);

exports.Club = Club;
exports.Subscribe = Subscribe;