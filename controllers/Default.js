'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');

// module.exports.createOperation = function createOperation (req, res, next) {
//   var operation = req.swagger.params['Operation'].value;
//   Default.createOperation(operation)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };
module.exports.createOperation = function createOperation (req, res, next) {
  var operation = req.swagger.params['operation'].value;
  Default.createOperation(operation)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (err) { 
      if(err === "ID DUPLICATE")
      utils.writeJson(res, "operation with ID already exist",408); 
      else
      utils.writeJson(res, err,500);
    });
};

// module.exports.deleteOperation = function deleteOperation (req, res, next) {
//   var id = req.swagger.params['id'].value;
//   Default.deleteOperation(id)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };
module.exports.deleteOperation = function deleteOperation (req, res, next) {
  var id = req.swagger.params['id'].value;
  Default.deleteOperation(id)
    .then(function (response) {
      utils.writeJson(res, "operation deleted succesfully");
    })
    .catch(function (err) {
      if(err === "NOT FOUND")
      utils.writeJson(res, "operation not found", 404);
      else
      utils.writeJson(res, err, 500);
    });
};

// module.exports.getOperation = function getOperation (req, res, next) {
//   Default.getOperation()
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

module.exports.getOperations = function getOperations (req, res, next) {
  Default.getOperations()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (err) {
      if(err === "EMPTY") utils.writeJson(res, "list is empty, no operations", 404);
      else utils.writeJson(res,err, 500);
    });
};



// module.exports.getOperationByID = function getOperationByID (req, res, next) {
//   var id = req.swagger.params['id'].value;
//   Default.getOperationByID(id)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

module.exports.getOperationByID = function getOperation (req, res, next) {
  var id = req.swagger.params['id'].value;
  Default.getOperationByID(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (err) {
      if (err === "NOT FOUND") utils.writeJson(res, err, 404);
      else utils.writeJson(res, err, 500);
    });
};

// module.exports.updateOperation = function updateOperation (req, res, next) {
//   var id = req.swagger.params['id'].value;
//   var operation = req.swagger.params['operation'].value;
//   Default.updateOperation(id,operation)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

module.exports.updateOperation = function updateOperation (req, res, next,) {
  var id = req.swagger.params['id'].value;
  var operation = req.swagger.params['operation'].value;
  Default.updateOperation(id, operation)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (err) {
      if(err === "NOT FOUND") utils.writeJson(res, "bad input parameter",400);
      else utils.writeJson(res, "server error",500);
    });
};

