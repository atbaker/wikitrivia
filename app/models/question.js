// app/models/question.js

var mongoose = require('mongoose');

module.exports = mongoose.model('Question', {
    question: {type: String},
    answer: {type: String}
});
