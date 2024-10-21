let Questions = require("../models/questions");
let Tags = require("../models/tags");
let Answers = require("../models/answers");
let Users = require("../models/user");
let Comments = require("../models/comment");

exports.increaseQuestionViewCount = async function (req, res) {
  await Questions.updateOne({_id: req.body._id}, {$inc : {num_views: 1}});
  const query = Questions.find({_id: req.body._id}).populate("tags").populate({
    path: 'answers',
    populate: [
      {
        path: 'ans_by',
        model: 'User',
        select: 'username',
      },
      {
        path: 'comments',
        populate: {
          path: 'user',
          model: 'User',
          select: 'username'
        }
      }
    ],
  }).populate({
    path: 'asked_by',
    model: 'User',
    select: 'username'
  }).populate({
    path: 'comments',
    populate: {
      path: 'user',
      model: 'User',
      select: 'username'
    }
  });
  const questionsResult = await query.exec();
  res.send(questionsResult);
}