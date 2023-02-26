'use strict';

const { Operation } = require("../models/Operation");
const { logger } = require("../utils/logger");
const { broadcastRefresh } = require("../utils/socket");

/**
 * adds an inventory item
 * adds an operation to the database
 *
 * operation Operation the Operation object to add (optional)
 * no response value expected for this operation
 **/

exports.createOperation = function createOperation(operation) {
  return new Promise((resolve, reject)=>{
      let newOp = {amount:operation.amount,priority: operation.priority}

      Operation.create(newOp).then(()=>{
        broadcastRefresh();
        resolve();
      }).catch(()=>{
        reject();
      });
    })

}



/**
 * delete an operation
 * delete an operation
 *
 * id BigDecimal the id of the target operation
 * no response value expected for this operation
 **/

exports.deleteOperation = function deleteOperation(id) {
      return new Promise((resolve,reject)=>{
        Operation.findByPk(id).then((op)=>{
          op.destroy({"id":id}).then(()=>{
            broadcastRefresh();
            resolve();
          }).catch((err)=>{
            reject("internal server error");
          })
        }).catch((err)=>{
          reject("NOT FOUND");
      })
  })
}



/**
 * fetches all operations
 * fetches all the operations
 *
 * returns List
 **/

exports.getOperations = function getOperations() {
  return new Promise(function(resolve, reject) {
    Operation.findAll().then((opArr)=>{
      if(opArr.length > 0) resolve(opArr);
      else reject("EMPTY")
    }).catch((err)=>{
      reject("server error");
    })

  });
}



/**
 * retrieve a specific operation
 * retrieve a specific operation by specifying the ID as apath param
 *
 * id BigDecimal the id of the target operation
 * returns List
 **/

exports.getOperationByID = function getOperationByID(id) {
  return new Promise(function(resolve, reject) {

    Operation.findByPk(id).then((op)=>{
      if(op !== null) resolve(op);
      else reject("NOT FOUND");
    }).catch((err)=>{
      reject("server error");
    })
 
  });
}



/**
 * update an operation
 * update an operation
 *
 * id BigDecimal the id of the target operation
 * operation Operation new operation data (optional)
 * no response value expected for this operation
 **/

function updateOperation(id,operation) {
  return new Promise(function(resolve, reject) {
    logger.info(operation);
    let newOp = new Operation();
    Operation.update(operation,{where: {"id": id}}).then((count)=>{
      if(count > 0){
        broadcastRefresh();
        resolve("operation updated successfilly");
      } 
      else reject("NOT FOUND");
    }).catch(()=>{
      reject("server error");
    })
  });
}


exports.updateOperation = updateOperation;