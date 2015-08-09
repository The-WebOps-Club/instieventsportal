'use strict';

var _ = require('lodash');
var Admin = require('./admin.model');
var mailer=require('../../components/mailer');

var myFunc = function (req,res){
  // Getting admin role from current admin
  var adminRole = req.user.role;
   
  // role created is valid only upto April 30 of next year
  var validityDate = new Date();
  if(validityDate.getMonth()<=3)  validityDate.setFullYear(validityDate.getFullYear(),3,30);
  else  validityDate.setFullYear(validityDate.getFullYear() + 1, 3, 30);
  
  adminRole.expiryDate = validityDate;
  
  if(req.body.club)
  {
   adminRole.name = 'convenor';
   adminRole.club = req.body.club; 
  }
  else
  {
    adminRole.name= req.params.role;
  }
  
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

// Creates a new admin in the DB.
exports.create = function(req, res) {
  Admin.create(req.body, function(err, admin) {
    if(err) { return handleError(res, err); }
    return res.json(201, admin);
  });
};

exports.addConvenor = function(req,res){
  myFunc(req,res);
}

exports.addSecRole = function(req,res){
  myFunc(req,res);
}

// // Adding convenor admin
// exports.addConvenor = function(req, res){
  
//   //mailer('insti-events-portal','new admin has been created',req.body.rollNumber+'@smail.iitm.ac.in',req.params.id);
//   // Getting admin role from current admin
//   var adminRole = req.user.role;
   
//   // role created is valid only upto April 30 of next year
//   var validityDate = new Date();
//   if(validityDate.getMonth()<=3)  validityDate.setFullYear(validityDate.getFullYear(),3,30);
//   else  validityDate.setFullYear(validityDate.getFullYear() + 1, 3, 30);
  
//   adminRole.expiryDate = validityDate;
//   adminRole.name = 'convenor';
//   adminRole.club = req.body.club;
  
//   // For error and success message
//   var response;

//   // Check if user exists
//   var query = { rollNumber : req.body.rollNumber};
  
//   Admin.find(query, function (err, admin) {
    
//     // Passing admin role
//     var adminObje = new Admin(req.body);
//     adminObje.role = adminRole;

//     if(err) { return handleError(res, err); }
//     if(!admin) { return res.send(404); }
//     if (admin.length < 1){
//       Admin.create(adminObje, function(err, admin) {
//         if(err) { 
//           response = handleError(res, err);
//           return response; 
//         }
//         response = res.json(201, admin);
//         return response;
//       });
//     } else {
//       adminObje = new Admin(admin[0]);
//       adminObje.role = adminRole;
//       Admin.update(query, { role : adminRole }, function(err, numberAffected, rawResponse) {
//         if (err) { return handleError(res, err); }
//         response = res.json(200, adminObje);
//         //mailing the details
//         mailer('insti-events-portal','you have been added as an admin and your password is '+req.body.password,req.body.rollNumber+'@smail.iitm.ac.in','litsoc-',function cb(err,info)
//         {
//           if(err)
//             return response.json(501,err);
//           else
//             return response.json(201,info);
//         });
//         return response;
//       })
//       return response;
//     }
//     return response;
//   });
// };

// // Add a new role to admin.
// exports.addSecRole = function(req, res) {
  
//   // Getting admin role from current admin
//   var adminRole = req.user.role;

//   // role created is valid only upto April 30 of next year
//   var validityDate = new Date();
//   if(validityDate.getMonth()<=3)  validityDate.setFullYear(validityDate.getFullYear(),3,30);
//   else  validityDate.setFullYear(validityDate.getFullYear() + 1, 3, 30);

//   adminRole.expiryDate = validityDate;
//   adminRole.name = req.params.role;

//   // For error and success message
//   var response; 

//   // Check if user exists
//   var query = { rollNumber : req.body.rollNumber};

//   Admin.find(query, function (err, admin) {
    
//     // Passing admin role
//     var adminObje = new Admin(req.body);
//     adminObje.role = adminRole;
    
//     if(err) { return handleError(res, err); }
//     if(!admin) { return res.send(404); }
//     if (admin.length < 1){
//       Admin.create(adminObje, function(err, admin) {
//         if(err) { 
//           response = handleError(res, err);
//           return response; 
//         }
//         response = res.json(201, admin);
//         return response;
//       });
//     } else {
//       adminObje = new Admin(admin[0]);
//       adminObje.role = adminRole;
//       Admin.update(query, { role : adminRole }, function(err, numberAffected, rawResponse) {
//         if (err) { return handleError(res, err); }
//         response = res.json(200, adminObje);
//         //mailing the details
//         mailer('insti-events-portal','you have been added as an admin and your password is '+req.body.password,req.body.rollNumber+'@smail.iitm.ac.in','litsoc-',function cb(err,info)
//           {
//             if(err)
//               return response.json(501,err);
//             else
//               return response.json(201,info);
//           });
//         return response;
//         //mailer('insti-events-portal','you have been added as a convenor and your password is '+req.body.password,req.body.rollNumber+'@smail.iitm.ac.in','litsoc');
//       })
//       return response;
//     }
//     return response;

//   });
// };

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
