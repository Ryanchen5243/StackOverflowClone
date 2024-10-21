let Questions = require("../models/questions");
let Tags = require("../models/tags");
let Answers = require("../models/answers");
let Users = require("../models/user");

exports.addAnswerToQuestion = async function (req, res) {
  const user = await Users.findOne({email: req.session.user}).exec();
  if (!user) return res.send(401);
  let answer = new Answers({
    text: req.body.answer.text,
    ans_by: user._id,
    ans_date_time: req.body.answer.ans_date_time,
    comments: [],
    num_votes: 0
  });

  await answer.save();
  await Users.updateOne(
    {_id: user._id},
    {$push: {answers_created: answer}}
  );
  await Users.updateOne(
    {_id: user._id},
    {$push: {questions_answered: req.body.question_id}}
  );
  answer = await Answers.findById(answer._id).populate({
    path: 'ans_by',
    model: 'User',
    select: 'username'
  }).populate({
    path: 'comments',
    populate: {
      path: 'user',
      model: 'User',
      select: 'username'
    }
  }).exec();
  await Questions.updateOne(
    {_id: req.body.question_id},
    {$push: {answers: {$each: [null], $position: 0}}}
  );
  await Questions.updateOne(
    {_id: req.body.question_id, "answers": null},
    {$set: {"answers.$": answer}}
  );

  res.send(answer);
}