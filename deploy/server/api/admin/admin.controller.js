'use strict';

var _ = require('lodash');
var Admin = require('./admin.model');
var mailer=require('../../components/mailer');
var async=require('async');
var crypto=require('crypto');
var gcm = require('../../components/gcm');
var gcm_data = require('../../components/gcm-data')
var User = require('../user/user.model');
var Event = require('../event/event.model');

function getUsers()
{
  var regIds = [];
  var i,j,k=0;
  var len=-1;
  User.find(function (err, users) {
    len=users.length;
    for(i=0; i<users.length; i++) {
      for(j=0; j<users[i].deviceId.length; j++) {
        regIds[k++] = users[i].deviceId[j];
      }
    }
  });
  while(i!=len) { require('deasync').sleep(10); }
  return regIds; 
};

function getUserByHostel(hostelName)
{
  var regIds = [];
  var i,j,k=0;
  var len=-1;
  var query = { hostel : hostelName };
  User.find(query,function (err, users) {
    len=users.length;
    for(i=0; i<users.length; i++) {
      for(j=0; j<users[i].deviceId.length; j++) {
        regIds[k++] = users[i].deviceId[j];
      }
    }
  });
  while(i!=len) { require('deasync').sleep(10); }
  return regIds; 
};


var createAdmin = function (adminRole,req,res){
  // For error and success message
  var response;

  // Check if user exists
  var query = { rollNumber : req.body.rollNumber};
  
  Admin.find(query, function (err, admin) {
    
    // Passing admin role
    var adminObje = new Admin(req.body);
    adminObje.role = adminRole;

    if(err) { return handleError(res, err); }
    if(!admin) { return res.send(404); }
    if (admin.length < 1){
      Admin.create(adminObje, function(err, admin) {
        if(err) { 
          response = handleError(res, err);
          return response; 
        }
        response = res.json(201, admin);
        return response;
      });
    } else {
      adminObje = new Admin(admin[0]);
      adminObje.role = adminRole;
      Admin.update(query, { role : adminRole }, function(err, numberAffected, rawResponse) {
        if (err) { return handleError(res, err); }
        response = res.json(200, adminObje);
        // mailing the details
        mailer('insti-events-portal','you have been added as an admin and your password is '+req.body.password,req.body.rollNumber+'@smail.iitm.ac.in','litsoc-',function cb(err,info)
        {
          if(err)
            return response.json(501,err);
          else
            return response.json(201,info);
        });
        return response;
      })
      return response;
    }
    return response;
  });
};



// Get list of admins
exports.index = function(req, res) {
  Admin.find(function (err, admins) {
    if(err) { return handleError(res, err); }
    return res.json(200, admins);
  });
};

// Get a single admin
exports.show = function(req, res) {
  Admin.findById(req.params.id, function (err, admin) {
    if(err) { return handleError(res, err); }
    if(!admin) { return res.send(404); }
    return res.json(admin);
  })
  .populate('role.club', 'name');
  ;
};

// // Creates a new admin in the DB.
// exports.create = function(req, res) {
//   Admin.create(req.body, function(err, admin) {
//     if(err) { return handleError(res, err); }
//     return res.json(201, admin);
//   });
// };

exports.addConvenor = function(req,res){

  // Getting admin role from current admin
  var adminRole = req.user.role;
   
  // role created is valid only upto April 30 of next year
  var validityDate = new Date();
  if(validityDate.getMonth()<=3)  validityDate.setFullYear(validityDate.getFullYear(),3,30);
  else  validityDate.setFullYear(validityDate.getFullYear() + 1, 3, 30);
  
  adminRole.expiryDate = validityDate;
  adminRole.name = 'convenor';
  adminRole.club = req.body.club;

  createAdmin(adminRole,req,res);
};


exports.addSecRole = function(req,res){
  // Getting admin role from current admin
  var adminRole = req.user.role;
   
  // role created is valid only upto April 30 of next year
  var validityDate = new Date();
  if(validityDate.getMonth()<=3)  validityDate.setFullYear(validityDate.getFullYear(),3,30);
  else  validityDate.setFullYear(validityDate.getFullYear() + 1, 3, 30);
  
  adminRole.expiryDate = validityDate;
  adminRole.name = req.params.role;
  
  createAdmin(adminRole,req,res);
};

// Updates an existing admin in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Admin.findById(req.user._id, function (err, admin) {
    if (err) { return handleError(res, err); }
    if(!admin) { return res.send(404); }
    var updated = _.merge(admin, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, admin);
    });
  });
};

//Change Password
exports.changePassword = function(req, res, next) {
  var adminId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  Admin.findById(adminId, function (err, admin) {
    if(err) { return handleError(res, err); }
    if(!admin) { return res.send(404); }
    if(admin.authenticate(oldPass)) {
      admin.password = newPass;
      admin.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

exports.forgotPassword = function(req, res, next) {

  async.waterfall([
    function (done) {
      crypto.randomBytes(25, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      Admin.findOne({ rollNumber : req.body.rollNumber }, function (err, admin) {
        if(err) { return handleError(res, err); }
        if(!admin) { return res.status(404).json({message: "Admin does not exist"}); }
        
        admin.resetPasswordToken = token;
        admin.resetPasswordExpires = Date.now() + 3600000; // one hour

        admin.save(function (err) {
          done(err, token, admin);
          var message = 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/resetPassword/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n';
           mailer('Password Reset Request',message,req.body.rollNumber + '@smail.iitm.ac.in','litsoc-',function (err, info) {
            if(err) { return res.status(500); }
            else { return res.status(200).json( { message: "Successful" } ); }
           });
         });
       });
     }
    ], function (err) {
    if(err) { return next(err); }
    res.redirect('/forgotPassword');
  });
};

exports.resetPassword = function(req, res) {
  Admin.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, admin) {
    if(err) { return handleError(res, err); }
    if(!admin) { return res.status(404).json({message: "Admin does not exist"}); }
    admin.password = req.body.newPassword;
    admin.token = '';
    admin.updatedOn = Date.now();
    admin.save(function (err, admin) {
      if(err) { return handleError(res, err); }
      var message = 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + admin.rollNumber + ' has just been changed.\n';
      mailer('Password Reset Confirmation',message,admin.rollNumber + '@smail.iitm.ac.in','litsoc-',function (err,info) {
        if(err) { return res.status(500); }
        else { return res.status(200).json({ message : "Successful"}); }
      });
    });
  });
};

// Deletes a admin from the DB.
exports.destroy = function(req, res) {
  Admin.findById(req.params.id, function (err, admin) {
    if(err) { return handleError(res, err); }
    if(!admin) { return res.send(404); }
    admin.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.updateNotif = function (req, res) {
  gcm_data("New Update Available",0,"",getUsers());
  return res.send("Success");
};

exports.eventNotif = function (req, res) {
  Event.findById(req.params.id, function (err, event) {
    console.log(event);
    gcm(req.body.title,req.body.message,1,event,getUsers());
    return res.send("Success");
  })
  .populate('result.hostel', 'name');
  ;
};

exports.hostelNotif = function (req, res) {
  Event.findById(req.params.id, function (err, event) {
    gcm(req.body.title,req.body.message,2,event,getUserByHostel(req.body.hostel));
    return res.send("Success");
  })
  .populate('result.hostel', 'name');
  ;
};



function handleError(res, err) {
  return res.send(500, err);
}
