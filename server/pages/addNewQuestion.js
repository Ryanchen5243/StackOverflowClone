let Questions = require("../models/questions");
let Tags = require("../models/tags");
let Answers = require("../models/answers");
let Users = require("../models/user");

// helper functions -> create tag
async function tagCreate(name) {
  const res = await Tags.find({name: name}).exec();

  if (res.length == 0) {
    let tag = new Tags({name: name, num_questions: 1});
    return tag.save();
  }
  res[0].num_questions++;
  return res[0].save();
}

exports.addNewQuestion = async function (res, newQDetails, userEmail) {
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
// const questionSchema = new Schema({
//   title: {type: String, required: true, maxLength: 100},
//   text: {type: String, required:true},
//   tags: [{type: Schema.Types.ObjectId, required: true, ref: 'Tag'}],
//   answers: [{type: Schema.Types.ObjectId, ref: 'Answer'}],
//   asked_by: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
//   ask_date_time: {type: Date, default: Date.now},
//   num_views: {type: Number, default: 0},
//   num_votes: {type: Number, default: 0},
//   comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
// });
  // extract question data
  const questionDetails = {
    title: newQDetails.title,
    summary: newQDetails.summary,
    text: newQDetails.text,
    asked_by: user._id,
    tags: tags,
    ask_date_time: newQDetails.ask_date_time
  }; // answers, ask_date_time and views will take on default values

  const theNewQ = new Questions(questionDetails);
  await theNewQ.save();
  await Users.updateOne(
    {_id: user._id},
    {$push: {questions_asked: theNewQ}}
  );
  // theNewQ.asked_by = user.name;
  //console.log(theNewQ);
    const query = Questions.findById(theNewQ._id).populate("tags").populate("asked_by", "username").sort({ask_date_time: -1});
    // execute the query and send back response to client
    const questionsResult = await query.exec();
    //for (q of questionsResult) q.asked_by = q.asked_by.username;
    //console.log(questionsResult);
  res.send(questionsResult);
}