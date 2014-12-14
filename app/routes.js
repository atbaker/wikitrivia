// app/routes.js

var Question = require('./models/question');

module.exports = function(app) {
  app.get('/api/questions', function(req, res) {
      Question.find(function(err, questions) {
        if (err)
            res.send(err);

        res.json(questions);
      });
  });
  
  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });

};
