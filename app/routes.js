// app/routes.js

var Question = require('./models/question');
var game = require('./game');

module.exports = function(app) {
  app.get('/api/questions', function(req, res) {
    var query = Question.find().limit(5); // Real limit is 10

    query.exec(function(err, questions) {
      if (err) {
        res.send(err);
      }
      game.setQuestions(questions);
      res.json(questions);
    });
  });
  
  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });

};
