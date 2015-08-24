'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var authTypes = ['github', 'twitter', 'facebook', 'google'];
var crypto = require('crypto');

// role created is valid only upto April 30 of next year
var validityDate = new Date();
if(validityDate.getMonth()<=3)  validityDate.setFullYear(validityDate.getFullYear(),3,30);
else  validityDate.setFullYear(validityDate.getFullYear() + 1, 3, 30);

var AdminSchema = new Schema({
  name:  {type : String, required: true},
  rollNumber: {type : String, required: true},
  salt : String,
  hashedPassword: {type : String, required: true},
  role: {
  	name : { type: String, required : true },
  	category : { type: String, required : true },
  	expiryDate : { type: Date, required : true , default : validityDate},
    club : { type: Schema.Types.ObjectId, ref: 'Club' }
  },
  resetPasswordToken : { type : String },
  resetPasswordExpires : { type :Date },
});

/**
 * Virtuals
 */
AdminSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
AdminSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
AdminSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty rollNumber
AdminSchema
  .path('rollNumber')
  .validate(function(rollNumber) {
  	if (rollNumber == null)  return 0;
    if (authTypes.indexOf(this.provider) !== -1 ) return true;
    return rollNumber.length;
  }, 'rollNumber cannot be blank');

// // Validate empty password
// AdminSchema
//   .path('hashedPassword')
//   .validate(function(hashedPassword) {
//   	// if ((this._password == null) || (this._password == ""))  return 0;
//     if (authTypes.indexOf(this.provider) !== -1) return true;
//     return hashedPassword.length;
//   }, 'Password cannot be blank');

// Validate rollNumber is not taken
AdminSchema
  .path('rollNumber')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({rollNumber: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified rollNumber address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
AdminSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
AdminSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('Admin', AdminSchema);