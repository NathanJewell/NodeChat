var path = require('path');
var express = require('express');
var app = express();
var io = require('socket.io');
var http = require('http');

app.set('port', (process.env.PORT || 8080))

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '/public', 'index.html'));
});


var server = http.createServer(app);
var inout = io.listen(server);
var sockets = [];

inout.sockets.on('connection', function(socket) {
    console.log('A user connected');
    sockets.push(socket);
    socket.emit('chat message', {msg: 'Welcome user'});
    socket.on('disconnect', function() {
        console.log('A user disconnected');
    });
    socket.on('chat message', function(msg){
        for(var i =0; i<sockets.length;i++) {
            sockets[i].emit('chat message', msg);
        }
        console.log('message object: ' + msg);
    });
});


server.listen(8080);
