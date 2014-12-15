// app/game.js

module.exports = {
  setQuestions: function(questions) {
    this.questions = questions;
  },

  startGame: function(clients) {
    this.players = clients;
    this.answers = {};
    this.choices = [];
    this.currentQuestion = 0;
  },

  recordAnswer: function(client, answer) {
    this.answers[client] = answer;
  },

  getChoices: function() {
    // Get the player's answers
    var answers = this.answers;

    // Add the real answer
    answers['real'] = this.questions[this.currentQuestion].answer;
    return answers;
  },

  recordChoice: function(client, choice) {
    this.choices.push({chooser: client, choice: choice});
  }
};