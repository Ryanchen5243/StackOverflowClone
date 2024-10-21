let Questions = require("../models/questions");
let Tags = require("../models/tags");
let Answers = require("../models/answers");
let Users = require("../models/user");
let Comments = require("../models/comment");

exports.getUserInformation = async function(req, res) {
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
}

exports.getAllUsers = async function(req, res) {
  const user = await Users.findOne({email: req.session.user}).exec();
  if(!user) return res.send(401);
  if(!user.isAdmin) return res.send(403);
  const users = await Users.find().populate("tags_created").populate({
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
  if(!users) return res.send(401);
  res.send(users);
}

exports.deleteUser = async function(req, res) {
  const user = await Users.findOne({email: req.session.user}).exec();
  const targetUser = await Users.findOne({_id: req.body.id}).exec();
  if(!user) return res.send(401);
  if(!user.isAdmin) return res.send(403);
  if(!targetUser) return res.send(401);
  await Users.deleteOne({ _id: targetUser._id });
  await Answers.deleteMany({ ans_by: targetUser._id });
  await Comments.deleteMany({ user: targetUser._id });
  const users = await Users.find().populate("tags_created").populate({
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
  if(!users) return res.send(401);
  res.send(users);
}