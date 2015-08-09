'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ConvenorSchema = new Schema({
  name: { type : String, required : true },
  email: { type : String, required: true },
  phoneNumber: { type : String, required : true },
  rollNumber:{type: String,required : true}
});

var ClubSchema = new Schema({
  name: { type : String, required : true },
  convenors: [ConvenorSchema],
  description: { type : String },
  category: { type : String, required : true },
  updatedOn: { type: Date, default : Date() },
  createdOn: { type: Date, default : Date() }
});

module.exports = mongoose.model('Club', ClubSchema);