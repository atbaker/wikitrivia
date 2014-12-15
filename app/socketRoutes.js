// app/socketRoutes.js

var game = require('./game');

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

    // Host events
    socket.on('question.submit', function(message) {
      if (message === 0) {
        // This is the first question of the game
        game.startGame(clients);
      }
      socket.broadcast.emit('question.submit', message);
    });

    socket.on('question.choose', function(message) {
      var choices = game.getChoices();
      socket.emit('choices', choices);
      socket.broadcast.emit('question.choose', {id: message, choices: choices});
    });

    // Client events
    socket.on('setName', function(message) {
      clients[socket.id]['name'] = message;
      socket.broadcast.to(host).emit('clientUpdate', clients);
    });

    socket.on('submitAnswer', function(message) {
      game.recordAnswer(socket.id, message);
      socket.broadcast.to(host).emit('answerSubmitted', socket.id);
    });

    socket.on('submitChoice', function(message) {
      game.recordChoice(socket.id, message);
      socket.broadcast.to(host).emit('choiceSubmitted', socket.id);
    });

  });
};
