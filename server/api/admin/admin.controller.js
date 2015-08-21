'use strict';

var _ = require('lodash');
var Admin = require('./admin.model');
var mailer=require('../../components/mailer');

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
        //mailing the details
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
  Admin.findById(req.params.id, function (err, admin) {
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
  var adminId = req.params.id;
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

function handleError(res, err) {
  return res.send(500, err);
}
