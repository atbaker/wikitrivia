// app/game.js

module.exports = {
  setQuestions: function(questions) {
    this.questions = questions;
  },

  startGame: function(clients) {
    this.players = clients;
    for (var player in this.players) {
      this.players[player].score = 0;
    }

    this.answers = {};
    this.choices = [];
    this.currentQuestion = 0;
  },

  recordAnswer: function(client, answer) {
    this.answers[client] = {text: answer, choosers: []};
  },

  getChoices: function() {
    // Get the player's answers
    var answers = this.answers;

    // Add the real answer
    answers['real'] = {text: this.questions[this.currentQuestion].answer, choosers: []};
    return answers;
  },

  recordChoice: function(client, choice) {
    this.choices.push({chooser: client, choice: choice});
  },

  getQuestionResults: function() {
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
  },

  nextQuestion: function() {
    this.answers = {};
    this.choices = [];
    this.currentQuestion++;
  }
};