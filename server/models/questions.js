const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  title: {type: String, required: true, maxLength: 50},
  summary: {type: String, required: true, maxLength: 140},
  text: {type: String, required:true},
  tags: [{type: Schema.Types.ObjectId, required: true, ref: 'Tag'}],
  answers: [{type: Schema.Types.ObjectId, ref: 'Answer'}],
  asked_by: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  ask_date_time: {type: Date, default: Date.now},
  num_views: {type: Number, default: 0},
  num_votes: {type: Number, default: 0},
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
});

questionSchema.index({ title: 'text', text: 'text'}, {default_language: 'none'});

questionSchema.virtual('num_answers').get(function () {
  return this.answers.length;
});

module.exports = mongoose.model('Question', questionSchema);