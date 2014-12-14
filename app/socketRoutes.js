// app/socketRoutes.js

module.exports = function(io) {
  var host;
  var clients = {};

  io.on('connection', function (socket) {

    socket.on('register', function (message) {
      if (message === 'host') {
        host = socket.id;
      } else {
        socket.join('gameRoom');
        clients[socket.id] = {};
      }
    });

    socket.on('setName', function(message) {
      clients[socket.id]['name'] = message;
      socket.broadcast.to(host).emit('clientUpdate', clients);
    });

  });
};
