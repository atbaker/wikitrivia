// app/models/question.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
    title: {type: String},
    question: {type: String},
    answer: {type: String}
});

questionSchema.statics.generateQuestionSet = function(cb) {
  this.find({}, function(err, results) {
    var questions = [];

    while (questions.length < 10) {
      var question = results[Math.floor(Math.random() * results.length)];
      var alreadyChosen = false;
      for (var i=0; i<questions.length; i++) {
        if (questions[i]._id === question._id) {
          alreadyChosen = true;
        }
      }

      if (!alreadyChosen) {
        questions.push(question);
      }
    }

    cb(null, questions);
  });
};

module.exports = mongoose.model('Question', questionSchema);
