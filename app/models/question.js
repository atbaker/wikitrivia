// app/models/question.js

var mongoose = require('mongoose');

module.exports = mongoose.model('Question', {
    title: {type: String},
    question: {type: String},
    answer: {type: String}
});
