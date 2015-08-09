'use strict';

var _ = require('lodash');
var Admin = require('./admin.model');

// Get list of admins
exports.index = function(req, res) {
  Admin.find(function (err, admins) {
    if(err) { return handleError(res, err); }
    return res.json(200, admins);
  });
};

exports.myTest = function (req, res) {
  // body...
}

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

// Creates a new admin in the DB.
exports.create = function(req, res) {
  Admin.create(req.body, function(err, admin) {
    if(err) { return handleError(res, err); }
    return res.json(201, admin);
  });
};

exports.addConvenor = function (req, res) {
  addConvenorFunc(req, res, function (response) {
    return response;
  })
}

// Adding convenor admin
exports.addConvenorFunc = function(req, res, cb){
  
  // Getting admin role from current admin
  var adminRole = req.user.role;

  // role created is valid only upto April 30 of next year
  var validityDate = new Date();
  validityDate.setFullYear(validityDate.getFullYear() + 1, 3, 30);
  adminRole.expiryDate = validityDate;
  adminRole.name = 'convenor';
  adminRole.club = req.body.club;

  // For error and success message
  var response;

  // Check if user exists
  var query = { rollNumber : req.body.rollNumber};

  Admin.find(query, function (err, admin) {
    
    // Passing admin role
    var adminObje = new Admin(req.body);
    adminObje.role = adminRole;

    if(err) { cb(handleError(res, err)); }
    else if(!admin) { return res.send(404); }
    else if (admin.length < 1){
      Admin.create(adminObje, function(err, admin) {
        if(err) { 
          response = handleError(res, err);
          cb(response); 
        }
        else{
          response = res.json(201, admin);
          cb(response);
        }
      });
    } else {
      adminObje = new Admin(admin[0]);
      adminObje.role = adminRole;
      Admin.update(query, { role : adminRole }, function(err, numberAffected, rawResponse) {
        if (err) { return handleError(res, err); }
        response = res.json(200, adminObje);
        return response;
      })
      return response;
    }
    return response;
  });
};

// Add a new role to admin.
exports.addSecRole = function(req, res) {
  
  // Getting admin role from current admin
  var adminRole = req.user.role;

  // role created is valid only upto April 30 of next year
  var validityDate = new Date();
  validityDate.setFullYear(validityDate.getFullYear() + 1, 3, 30);
  adminRole.expiryDate = validityDate;
  adminRole.name = req.params.role;

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
        return response;
      })
      return response;
    }
    return response;
  });
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