'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http');

var app = require('express')();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
let cors = require('cors');
const { authenticateDB, sequelize } = require('./models/dbConfig');
const { logger } = require('./utils/logger');
const { Operation } = require('./models/Operation');

var serverPort = process.env.PORT || 8080;

const { BucketQueue } = require('./utils/BucketQueue');
const { useSocket } = require('./utils/socket');


// testing authenctication to database and syncing tables
authenticateDB()
.then(()=>{
    logger.info("DB AUTH SUCCESS");
    logger.info("STNCING ALL TABLES ...")
    sequelize.sync({drop: true}).then(()=>{
        logger.info("SYNC SUCCESS");
    });
})
.catch((err)=>{
    logger.error("DB AUTH ERROR",err);
});



// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};


// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);


// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {


  // add cors support
  // IMPORTANT: it must be registered before other middlewares
  app.use(cors());

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());
  

  let server = http.createServer(app);


let io = useSocket(server);

server.listen(serverPort, function () {
  console.log("SERVER",server.address());

  console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
  console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});

});