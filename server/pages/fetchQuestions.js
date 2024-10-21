let Questions = require("../models/questions");
let Tags = require("../models/tags");
let Answers = require("../models/answers");

exports.getAllQuestions = async function (res) {
  try {
    // query the model to fetch all questions
    const query = Questions.find({}).populate("tags").populate("answers").populate("asked_by", "username").sort({ask_date_time: -1});
    // execute the query and send back response to client
    const questionsResult = await query.exec();
    //console.log(questionsResult);
    for (q of questionsResult) q.asked_by = q.asked_by.username;
    //console.log(questionsResult);
    res.send(questionsResult);
  } catch(err) {
    ("Could not get all questions" + err);
  }
}

exports.getNewestQuestions = async function(res) {
  try{
    const query = Questions.find({}).populate("tags").populate("answers").populate("asked_by", "username").sort({ask_date_time: -1});
    const newestQuestionsResult = await query.exec()

    res.send(newestQuestionsResult);
  } catch(err) {
    console.log("could not get newest questions" + err);
  }
}

exports.getActiveQuestions = async function(res) {
  try{
    const activeQuestionsResult = []
    const answerQuery = await Answers.find({}).exec();
    answerQuery.sort((a, b) => b.ans_date_time - a.ans_date_time);
    for (let a of answerQuery) {
      const questionsQuery = await Questions.findOne({answers: {$in: [a]}}).populate("tags").populate("answers").populate("asked_by", "username").exec();
      if (!activeQuestionsResult.some(q => q.title === questionsQuery.title)) {
        activeQuestionsResult.push(questionsQuery);
      }
    }
    const questionsQuery = await Questions.find({answers: {$size: 0}}).populate("tags").populate("answers").populate("asked_by", "username").exec();
    for (let q of questionsQuery) {
      activeQuestionsResult.push(q);
    }
    res.send(activeQuestionsResult)
  } catch(err) {
    console.log("could not get active questions" + err);
  }
}

exports.getUnansweredQuestions = async function(res) {
  try{
    const query = Questions.find({answers: {$size: 0}}).populate("tags").populate("answers").populate("asked_by", "username");
    const unansweredQuestionsResult = await query.exec()

    res.send(unansweredQuestionsResult);
  } catch(err) {
    console.log("could not get unanswered questions" + err);
  }
}