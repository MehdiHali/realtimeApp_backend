
const winston = require("winston");

exports.logger = winston.createLogger({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'logs.log' })
    ],
    format: winston.format.combine(winston.format.cli(),winston.format.timestamp(),winston.format.colorize({ all: true, }),),
    silent: true
  });
