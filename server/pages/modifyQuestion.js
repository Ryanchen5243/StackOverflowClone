let Questions = require("../models/questions");
let Tags = require("../models/tags");
let Answers = require("../models/answers");
let Users = require("../models/user");
let Comments = require("../models/comment");

// helper functions -> create tag
async function tagCreate(name) {
  const res = await Tags.find({name: name}).exec();

  if (res.length == 0) {
    let tag = new Tags({name: name, num_questions: 1});
    return tag.save();
  }
  res[0].num_questions++;
  return res[0];
}

exports.delete = async function(id, res) {
  try {
  const question = await Questions.findById(id)
  .populate('tags')
  .populate({
    path: 'answers',
    populate: {
      path: 'comments',
    },
  })
  .populate('comments');

if (!question) {
  console.log('Question not found');
  return;
}

await Comments.deleteMany({ _id: { $in: question.comments } });

for (const answerId of question.answers) {
  await Comments.deleteMany({ _id: { $in: answerId.comments } });
}

await Answers.deleteMany({ _id: { $in: question.answers } });

for (const tagId of question.tags) {
  const numQuestionsWithTag = await Questions.countDocuments({ tags: tagId });
  if (numQuestionsWithTag === 1) {
    await Tags.findByIdAndDelete(tagId);
  } else {
    await Tags.updateOne({_id: tagId}, {$inc : {num_questions: -1}})
  }
}

await Questions.findByIdAndDelete(id);
const query = Questions.find({}).populate("tags").populate("answers").populate("asked_by", "username").sort({ask_date_time: -1});
    // execute the query and send back response to client
    const questionsResult = await query.exec();
    //console.log(questionsResult);
    for (q of questionsResult) q.asked_by = q.asked_by.username;
    //console.log(questionsResult);
    res.send(questionsResult);
} catch (err) {
  res.status(500)
}
}

exports.modifyQuestion = async function (res, newQDetails, userEmail) {
  const user = await Users.findOne({email: userEmail}).exec();
  if (!user) return res.send(401);
  
  let tags = [];
  for (const t of newQDetails.tags) {
    const tag = await tagCreate(t);
    tags.push(tag);
    await Users.updateOne(
      {_id: user._id},
      {$push: {tags_created: tag}}
    );
  }
  const existingQuestion = await Questions.findById(newQDetails.id).populate('tags');
  if (!existingQuestion) {
    console.log('Question not found');
    return;
  }
  const newTags = tags || [];
  const tagsToDelete = existingQuestion.tags.filter(
    (tag) => !newTags.includes(tag._id.toString())
  );
  for (const tagId of tagsToDelete) {
    const numQuestionsWithTag = await Questions.countDocuments({ tags: tagId });
    if (numQuestionsWithTag === 1) {
      await Tags.findByIdAndDelete(tagId);
    } else {
      await Tags.updateOne({_id: tagId}, {$inc : {num_questions: -1}})
    }
  }
  existingQuestion.title = newQDetails.title;
  existingQuestion.summary = newQDetails.summary;
  existingQuestion.text = newQDetails.text;
  existingQuestion.tags = tags;
  
  await existingQuestion.save();
  const query = Questions.find({_id: existingQuestion._id}).populate("tags").populate({
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
