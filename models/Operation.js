const {Model,DataTypes} = require("sequelize");
const {sequelize} = require("./dbConfig");
const  bcrypt = require("bcrypt");
const { BQueue } = require("../utils/BucketQueue.js");
const { logger } = require("../utils/logger");
const { broadcastRefresh } = require("../utils/socket");
// const { updateOperation } = require("../service/DefaultService.js");

class Operation extends Model{}

Operation.init({
    id:{
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    amount:{
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    priority:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    reference:{
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    status:{
        type: DataTypes.STRING,
        allowNull: true,
        values: ["processed","queued"],

    },
},
{
    sequelize,
    modelName: "operation",
    createdAt: "timestamp",
    updatedAt: false,
    hooks:{
        
        beforeCreate: (record)=>{
            logger.error("BEFORE UPDATE "+record.getDataValue("amount"));
            let data = `${record.id}${record.amount}${record.priority}`;
            record.setDataValue("reference",bcrypt.hashSync(data,12));

            // ---

            let amount = record.getDataValue('amount');
            // console.log("amount: ", amount);
            if(amount > 100){
                record.setDataValue("status","processed");
            }
            else{
                record.setDataValue("status","queued");
            }
        },
        afterCreate: (record)=>{
            BQueue.insert({reference: record.getDataValue("reference"),priority: record.getDataValue("priority")});
            logger.info("inserting reference "+record.getDataValue("reference"));
            setTimeout(()=>{
                processOperation(BQueue);
            },10000);
        }        
    }
});

function processOperation(BQueue){
        logger.info("TIMER UPDATING THE OPERATION");
        let peak = BQueue.poll();
        logger.info("OPERATION IN PROCESS");
        console.log(peak);
        Operation.update({status:"processed"},{where: {"reference":peak.reference}})
        .then(()=>{ 
            logger.info("OPERATION UPDATED SUCCESSFULLY BY THE TIMER CALLLBACK");
            broadcastRefresh();

        }).catch((err)=>{
            logger.error("OPERATION NOT UPDATED SUCCESSFULLY BY THE TIMER CALLLBACK");
        })
}



exports.Operation = Operation;