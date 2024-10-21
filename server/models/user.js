const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required: true},
  password_hash: {type: String, required: true},
  email: {type: String, required: true, match: /^\S+@\S+\.\S+$/gm},
  reputation: {type: Number, required: true, default: 0},
  questions_asked: [{type: Schema.Types.ObjectId, ref: 'Question'}],
  date_joined: {type: Date, default: Date.now},
  questions_voted_on: [{question: {type: Schema.Types.ObjectId, ref: 'Question'}, upvote: {type: Boolean}}],
  answers_voted_on: [{answer: {type: Schema.Types.ObjectId, ref: 'Answer'}, upvote: {type: Boolean}}],
  isAdmin: {type: Boolean, default: false},
  tags_created: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
  questions_answered: [{type: Schema.Types.ObjectId, ref: 'Question'}],
  answers_created: [{type: Schema.Types.ObjectId, ref: 'Answer'}]
});


userSchema.virtual('membership_time').get(function () {
  return ((Date.now) - (this.date_joined));
});

module.exports = mongoose.model('User', userSchema);