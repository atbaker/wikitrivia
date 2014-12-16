// app/game.js

var Question = require('./models/question');
var utils    = require('./utils');

module.exports = function() {
  var game = {
    answers: {},
    responses: [],
    currentQuestion: 0,
    started: false
  };

  game.startGame = function(clients) {
    this.players = clients;
    for (var player in this.players) {
      this.players[player].score = 0;
    }

    this.started = true;
  };

  game.recordAnswer = function(client, answer) {
    this.answers[client] = {text: answer, choosers: []};
  };

  game.getChoices = function(questionId, callback) {
    var self = this;
    var choices = [];

    // Get the players' answers
    for (var answer in this.answers) {
      choices.push({text: this.answers[answer].text, submitter: answer});
    }

    // Add the real answer
    var query = Question.findOne({_id: questionId}, function(err, question) {
      if (err) {
        console.log(err);
      }

      self.answers['real'] = {text: question.answer, choosers: []};
      choices.push({text: question.answer, submitter: 'real'});

      callback(utils.shuffle(choices));
    });
  };

  game.recordChoice = function(client, choice) {
    this.responses.push({chooser: client, choice: choice});
  };

  game.getQuestionResults = function() {
    // outputs: who picked which answer, which answers got picked
    for (var i=0; i < this.responses.length; i++) {
      var response = this.responses[i];
      this.answers[response.choice].choosers.push(response.chooser);
    }

    // update scores
    for (var player in this.answers) {
      var answer = this.answers[player];
      if (player === 'real') {
        for (var i=0; i < answer.choosers.length; i++) {
          this.players[answer.choosers[i]].score += 100;
        }
      } else {
        this.players[player].score += answer.choosers.length * 50;
      }
    }

    return {answers: this.answers, players: this.players};
  };

  game.nextQuestion = function() {
    this.answers = {};
    this.responses = [];
    this.currentQuestion++;
  };

  return game;
};
