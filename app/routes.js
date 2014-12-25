// app/routes.js

var Question = require('./models/question');

module.exports = function(app) {
  app.get('/api/questions', function(req, res) {
    // var query = Question.find().limit(10);

    Question.generateQuestionSet(function(err, questions) {
      if (err) {
        res.send(err);
      }
      res.json(questions);
    });
  });

  app.get('/api/articles', function(req, res) {
    Question.find().distinct('title', function(err, titles) {
      if (err) {
        res.send(err);
      }
      res.json(titles);
    });
  });
  
  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });

};
