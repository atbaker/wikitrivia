// app/load.js

var fs = require('fs');

var mongoose = require('mongoose');
var db = require('./config/db');

mongoose.connect(db.url);

var Question = require('./app/models/question');

Question.remove({}, function(err) {
  if (err) {
    return console.error(err);
  }
  console.log('Removed all existing documents');

  var questionFile = process.argv[2];
  fs.readFile(questionFile, 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }

    var questions = JSON.parse(data);
    for (var i=0; i < questions.length; i++) {
      var question = new Question(questions[i]);
      question.save(function(err, question) {
        if (err) {
          return console.error(err);
        }
        console.log('Loaded ' + questions.length + ' questions');
        process.exit(0);
      });
    }
  });
});
