// app/game.js

module.exports = {
  startGame: function(clients) {
    this.players = clients;
  },

  recordAnswer: function(client, answer) {
    this.players[client].answer = answer;
  }
};