// app/socketRoutes.js

var Game = require('./game');

module.exports = function(io) {
  var sessionCounter = 0; // Temporary way to distinguish between games
  var sessions = {};

  io.on('connection', function (socket) {
    var session, game;

    socket.on('register', function (message) {
      if (message === 'host') {
        sessionCounter++;
        sessions[sessionCounter] = {host: socket.id, clients: {}, game: new Game()};

        session = sessions[sessionCounter];
        game = session.game;
      } else {
        // socket.join('gameRoom');
        session = sessions[sessionCounter];
        game = session.game;

        session.clients[socket.id] = {};
      }
    });

    // Host events
    socket.on('question.submit', function() {
      if (!game.started) {
        // This is the first question of the game
        game.startGame(session.clients);
      } else {
        // This is not the first question - prepare the
        // game for a new question
        game.nextQuestion();
      }
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
      session.clients[socket.id]['name'] = name;
      socket.broadcast.to(session.host).emit('clientUpdate', session.clients);
    });

    socket.on('submitAnswer', function(answer) {
      game.recordAnswer(socket.id, answer);
      socket.broadcast.to(session.host).emit('answerSubmitted', socket.id);
    });

    socket.on('submitChoice', function(choice) {
      game.recordChoice(socket.id, choice);
      socket.broadcast.to(session.host).emit('choiceSubmitted', socket.id);
    });

  });
};
