'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var CoordSchema = new Schema({
	name : { type : String, required : true },
	phoneNumber : { type : String, required : true },
	email : { type : String, required : true }
});

var ResultSchema = new Schema({
	hostel : { type : Schema.Types.ObjectId, ref : 'Hostel', required : true, unique : true },
	score : { type : Number, default : 0}
});

var EventSchema = new Schema({
	name : { type : String, required : true },
	time : { type : Date},
	venue : { type : String},
	description : { type : String, required : true},
	details : String,
	active : { type : Boolean, default: true },
	isLitSocEvent : { type : Boolean, required : true, default : false },
    club : { type: Schema.Types.ObjectId, ref: 'Club' },
    createdOn : { type : Date, default : Date()},
    updatedOn : { type : Date, default : Date()},
	category : { type : String, required : true },
	coords : [CoordSchema],
	result : [ResultSchema]
});

EventSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Event', EventSchema);