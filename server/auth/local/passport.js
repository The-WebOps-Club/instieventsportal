var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Admin = require('../../api/admin/admin.model');

exports.setup = function (User, config) {
  passport.use('user-local', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
      User.findOne({
        email: email.toLowerCase()
      }, function(err, user) {
        if (err) return done(err);

        if (!user) {
          return done(null, false, { message: 'This email is not registered.' });
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: 'This password is not correct.' });
        }
        return done(null, user);
      });
    }
  ));

  // For admin roles
  passport.use('admin-local', new LocalStrategy({
      usernameField: 'rollNumber',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(rollNumber, password, done) {
      Admin.findOne({
        rollNumber: rollNumber.toLowerCase()
      }, function(err, user) {
        if (err) return done(err);
        if (!user) {
          return done(null, false, { message: 'This rollNumber is not registered.' });
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: 'This password is not correct.' });
        }
        return done(null, user);
      });
    }
  ));
};