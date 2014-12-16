// app/game.js

var Question = require('./models/question');

module.exports = function() {
  var game = {
    answers: {},
    choices: [],
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
    // Get the player's answers
    var answers = this.answers;

    // Add the real answer
    var query = Question.findOne({_id: questionId}, function(err, question) {
      if (err) {
        console.log(err);
      }
      answers['real'] = {text: question.answer, choosers: []};
      callback(answers);
    });
  };

  game.recordChoice = function(client, choice) {
    this.choices.push({chooser: client, choice: choice});
  };

  game.getQuestionResults = function() {
    // outputs: who picked which answer, which answers got picked
    for (var i=0; i < this.choices.length; i++) {
      var response = this.choices[i];
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
    this.choices = [];
    this.currentQuestion++;
  };

  return game;
};
