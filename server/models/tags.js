const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: {type: String, required: true},
  num_questions: {type:Number,default:0},
});

tagSchema.index({name: 'text'});

module.exports = mongoose.model('Tag', tagSchema);