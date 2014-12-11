// app/routes.js

var Question = require('./models/question');

module.exports = function(app) {
  app.get('/api/questions', function(req, res) {
      Question.find(function(err, nerds) {
        if (err)
            res.send(err);

        res.json(nerds);
      });
  });
  
  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });

};
