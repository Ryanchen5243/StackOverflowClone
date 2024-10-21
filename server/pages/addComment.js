let Questions = require("../models/questions");
let Tags = require("../models/tags");
let Answers = require("../models/answers");
let Users = require("../models/user");
let Comments = require("../models/comment");

exports.toQuestion = async function (req, res) {
  const user = await Users.findOne({email: req.session.user}).exec();
  if (!user) return res.send(401);
  let comment = new Comments({
    text: req.body.comment.text,
    user: user._id,
    date_created: req.body.comment.date_created,
    num_votes: 0
  });
  await comment.save();
  await Questions.updateOne(
    {_id: req.body.question_id},
    {$push: {comments: {$each: [null], $position: 0}}}
  );
  await Questions.updateOne(
    {_id: req.body.question_id, "comments": null},
    {$set: {"comments.$": comment}}
  );

  const query = Questions.find({_id: req.body.question_id}).populate("tags").populate({
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
  return res.send(questionsResult);
}

exports.toAnswer = async function (req, res) {
  const user = await Users.findOne({email: req.session.user}).exec();
  if (!user) return res.send(401);
  let comment = new Comments({
    text: req.body.comment.text,
    user: user._id,
    date_created: req.body.comment.date_created,
    num_votes: 0
  });
  await comment.save();
  await Answers.updateOne(
    {_id: req.body.answer_id},
    {$push: {comments: {$each: [null], $position: 0}}}
  );
  await Answers.updateOne(
    {_id: req.body.answer_id, "comments": null},
    {$set: {"comments.$": comment}}
  );

  const query = Questions.find({_id: req.body.question_id}).populate("tags").populate({
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
  return res.send(questionsResult);
}