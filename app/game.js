// app/game.js

var Question = require('./models/question');
var utils    = require('./utils');

module.exports = function() {
  var game = {
    answers: {}, // Keyed on answer text, each property is a list of who authored that answer
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

  game.addPlayer = function(socketId, name) {
    this.players[socketId] = {name: name, score: 0};
  };

  game.recordAnswer = function(client, answer) {
    if (!this.answers.hasOwnProperty(answer)) {
      this.answers[answer] = {submitters: [client], choosers: [], truth: false};
    } else {
      this.answers[answer].submitters.push(client);
    }
  };

  game.setTruth = function(answer) {
    if (!this.answers.hasOwnProperty(answer)) {
      this.answers[answer] = {submitters: [], choosers: [], truth: true};
    } else {
      this.answers[answer].truth = true;
    }
  };

  game.padAnswers = function(similarWords) {
    if (Object.keys(this.answers).length >= 8) {
      return;
    }

    for (var i=0; i<similarWords.length; i++) {
      var similarWord = similarWords[i];
      if (!this.answers.hasOwnProperty(similarWords[i])) {
        this.answers[similarWord] = {submitters: [], choosers: [], truth: false};
      }
      if (Object.keys(this.answers).length === 8) {
        break;
      }
    }
  };

  game.getChoices = function(questionId, callback) {
    var self = this;

    // Add the real answer
    var query = Question.findOne({_id: questionId}, function(err, question) {
      if (err) {
        console.log(err);
      }

      self.setTruth(question.answer);
      self.padAnswers(question.similar_words);

      var choices = Object.keys(self.answers);
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
    for (var answerText in this.answers) {
      var answer = this.answers[answerText];

      if (answer.truth) {
        // Award 100 points to each of the submitters
        for (var i=0; i<answer.submitters.length; i++) {
          this.players[answer.submitters[i]].score += 100;
        }
        // Award 100 points to each of the choosers
        for (var i=0; i<answer.choosers.length; i++) {
          this.players[answer.choosers[i]].score += 100;
        }
      } else {
        // Award 50 points to each submitter for each player who chose the lie
        for (var i=0; i<answer.submitters.length; i++) {
          this.players[answer.submitters[i]].score += answer.choosers.length * 50;
        }
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
