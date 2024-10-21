let Questions = require("../models/questions");
let Tags = require("../models/tags");
let Answers = require("../models/answers");
let Users = require("../models/user");
let Comments = require("../models/comment");

exports.delete = async function(req, res) {
  try {
    const answer = await Answers.findById(req.body.id).populate("comments");
    if (!answer) {
      console.log('Question not found');
      return;
    }
    await Comments.deleteMany({ _id: { $in: answer.comments } });
    await Answers.findByIdAndDelete(req.body.id);
    const user = await Users.findOne({email: req.session.user}).populate("tags_created").populate({
      path: "questions_asked",
      populate: {
        path: "tags",
        model: "Tag",
        select: "name"
      },
      options: {
        sort: { ask_date_time: -1 },
      },
    }).populate("answers_created").exec();
    if (!user) return res.send(401);
    res.send(user);

  } catch (err) {
    res.status(500)
  }
}

exports.modify = async function(req, res) {
  try {
    const answer = await Answers.findById(req.body.id).exec();
    if (!answer) {
      console.log('Answer not found');
      return;
    }
    answer.text = req.body.text;
    await answer.save();
    const user = await Users.findOne({email: req.session.user}).populate("tags_created").populate({
      path: "questions_asked",
      populate: {
        path: "tags",
        model: "Tag",
        select: "name"
      },
      options: {
        sort: { ask_date_time: -1 },
      },
    }).populate("answers_created").exec();
    if (!user) return res.send(401);
    res.send(user);

  } catch (err) {
    res.status(500)
  }
}