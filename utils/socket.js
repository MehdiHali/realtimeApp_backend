let io = require("socket.io");
const { logger } = require("./logger");

function useSocket(server){
    // create websocket server
    io = io(server,{origin:"*",  cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }});

    ioListen();

    return io;
}

/**
 * listen for websocket connections
*/
function ioListen(){

  io.on('connection', socket => {

    // listenForUpdates(socket);
    console.info("WS: listening");

  })
}


/**
 * tells clients to refresh their data
 */
function broadcastRefresh(){
  logger.info("BROADCASTING REFRESH");
    io.emit('refresh', "refresh");
}

/**
 * listen for refresh messages
 */
function listenForUpdates(socket){
    socket.on('refresh',(signal)=>{
    broadcastUpdates();
    }); 
}


exports.useSocket = useSocket;
exports.broadcastRefresh = broadcastRefresh;