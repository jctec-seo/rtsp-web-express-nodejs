var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const PORT = process.env.PORT || 8001;

// express server listener
server.listen( PORT, () =>
    console.log('Starting Express Web Server on Port http://localhost:'+PORT)
);
module.exports = {
    app, server, io
}