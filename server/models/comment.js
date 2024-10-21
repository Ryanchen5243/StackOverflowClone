const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  num_votes: {type: Number, default: 0},
  text: {type: String},
  date_created: {type: Date, default: Date.now},
  user: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Comment', commentSchema);