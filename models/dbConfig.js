
const {Sequelize} = require("sequelize");
require("dotenv").config();

const options = {
    username: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    dbname: process.env.DB_NAME
}

let DB_URL = process.env.DATABASE_URL || `postgres://${options.username}:${options.password}@${options.host}:${options.port}/${options.dbname}`;

// const config = {
//   production: {
//     use_env_variable: 'DATABASE_URL',
//     dialect: 'postgresql',
//     logging: false,
//     dialectOptions: {
//       ssl: {      /* <----- Add SSL option */
//         require: true,
//         rejectUnauthorized: false 
//       }
//     },
//   },
// }

let config = {
      logging: false,   //Loging disabled
      dialectOptions: {
        ssl:{
          require:true,
          rejectUnauthorized: false
        } 
      }
  }
const sequelize =  new Sequelize(DB_URL,config); // Example for postgres

async function authenticateDB(){
        sequelize.authenticate();
        console.log("authenticatoin to database successfull");
};



exports.sequelize = sequelize;
exports.authenticateDB = authenticateDB;