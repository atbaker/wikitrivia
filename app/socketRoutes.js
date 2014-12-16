// app/socketRoutes.js

var Game = require('./game');

module.exports = function(io) {
  var host;
  var clients = {};
  var game = new Game();

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
    socket.on('question.submit', function() {
      if (!game.started) {
        // This is the first question of the game
        game.startGame(clients);
      } else {
        // This is not the first question - prepare the
        // game for a new question
        game.nextQuestion();
      }
      console.log("CURRENTQUESTION" + game.currentQuestion);
      socket.broadcast.emit('question.submit', game.currentQuestion);
    });

    socket.on('question.choose', function(questionId) {
      var choices = game.getChoices(questionId, function(choices) {
        socket.emit('choices', choices);
        socket.broadcast.emit('question.choose', {currentQuestion: game.currentQuestion, choices: choices});
      });
    });

    socket.on('question.review', function() {
      var results = game.getQuestionResults();
      socket.emit('results', results);
      socket.broadcast.emit('question.review', game.currentQuestion);
    });

    socket.on('final', function() {
      socket.broadcast.emit('final');
    });

    // Client events
    socket.on('setName', function(name) {
      clients[socket.id]['name'] = name;
      socket.broadcast.to(host).emit('clientUpdate', clients);
    });

    socket.on('submitAnswer', function(answer) {
      game.recordAnswer(socket.id, answer);
      socket.broadcast.to(host).emit('answerSubmitted', socket.id);
    });

    socket.on('submitChoice', function(choice) {
      game.recordChoice(socket.id, choice);
      socket.broadcast.to(host).emit('choiceSubmitted', socket.id);
    });

  });
};
