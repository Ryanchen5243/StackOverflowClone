let Questions = require("../models/questions");
let Tags = require("../models/tags");
let Answers = require("../models/answers");
let Users = require("../models/user");
let Comments = require("../models/comment");

exports.delete = async function(req, res) {
  try {
    const usersWithThisTag = await Users.countDocuments({ tags_created: req.body.id });
    if (usersWithThisTag === 1) {
      await Tags.findByIdAndDelete(req.body.id);
    }
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
    }).exec();
    if (!user) return res.send(401);
    res.send(user);
  } catch (err) {
    res.send(500)
  } 
}

exports.modify = async function(req, res) {
  try {
    const usersWithThisTag = await Users.countDocuments({ tags_created: req.body.id });
    if (usersWithThisTag === 1) {
      const t = await Tags.findById(req.body.id).exec();
      t.name = req.body.name;
      t.save();
    }
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
    }).exec();
    if (!user) return res.send(401);
    res.send(user);
  } catch (err) {
    res.send(500)
  } 
}