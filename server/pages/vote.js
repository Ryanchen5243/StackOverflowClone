let Questions = require("../models/questions");
let Tags = require("../models/tags");
let Answers = require("../models/answers");
let Users = require("../models/user");
let Comments = require("../models/comment");


exports.upvote = async function(req, res) {
  const collections = [Questions, Answers, Comments];
  for (let collection of collections) {
    const found = await collection.findById(req.body.id).exec();
    if (found) {
      switch(collection) {
        case Questions:
          {
            await Questions.updateOne({_id: found._id}, {$inc : {num_votes: 1}});
            await Users.updateOne({_id: found.asked_by}, {$inc: {reputation: 5}});
            let q = await Questions.find({_id: req.body.qId}).populate("tags").populate({
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
            }).exec();
            return res.send(q);
          }
        case Answers:
          {
            await Answers.updateOne({_id: found._id}, {$inc : {num_votes: 1}});
            await Users.updateOne({_id: found.ans_by}, {$inc: {reputation: 5}});
            let q = await Questions.find({_id: req.body.qId}).populate("tags").populate({
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
            }).exec();
            return res.send(q);
          }
        case Comments:
          {
            await Comments.updateOne({_id: found._id}, {$inc : {num_votes: 1}});
            let q = await Questions.find({_id: req.body.qId}).populate("tags").populate({
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
            }).exec();
            return res.send(q);
          }
        default: console.log(":(");
      }
    }
  }
}

exports.downvote = async function(req, res) {
  const collections = [Questions, Answers, Comments];
  for (let collection of collections) {
    const found = await collection.findById(req.body.id).exec();
    if (found) {
      switch(collection) {
        case Questions:
          {
            await Questions.updateOne({_id: found._id}, {$inc : {num_votes: -1}});
            await Users.updateOne({_id: found.asked_by}, {$inc: {reputation: -10}});
            let q = await Questions.find({_id: req.body.qId}).populate("tags").populate({
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
            }).exec();
            return res.send(q);
          }
        case Answers:
          {
            await Answers.updateOne({_id: found._id}, {$inc : {num_votes: -1}});
            await Users.updateOne({_id: found.ans_by}, {$inc: {reputation: -10}});
            let q = await Questions.find({_id: req.body.qId}).populate("tags").populate({
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
            }).exec();
            return res.send(q);
          }
        default: console.log(":(");
      }

    }
  }
}