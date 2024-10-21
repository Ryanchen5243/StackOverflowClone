let Questions = require("../models/questions");
let Tags = require("../models/tags");
let Answers = require("../models/answers");


async function getResult(searchQuery) {
  let inputWords = searchQuery.trim().split(/\s+/);
  inputWords = [...new Set(inputWords)];
  let inputTags = inputWords.filter(w => ((w[0] === '[') && (w[w.length - 1] === ']')));
  inputTags = inputTags.map((w) => w.slice(1, w.length - 1));
  let resultTagsList = [];
  inputTags.forEach(t => resultTagsList = resultTagsList.concat(t.split("][")));
  inputTags = resultTagsList;
  inputWords = inputWords.filter(w => !((w[0] === '[') && (w[w.length - 1] === ']')));

  inputWords = inputWords.join(" ");
  inputTags = inputTags.join(" ");

  let questionsQuery = Questions.find({$text: {$search: inputWords}}).populate("tags").populate("answers");
  let questionsQueryResult = await questionsQuery.exec();

  let tagsQuery = Tags.find({$text: {$search: inputTags}});
  let tagsQueryResult = await tagsQuery.exec();
  

  tagsQuery = Questions.find({tags: {$in: tagsQueryResult}}).populate("tags").populate("answers");
  tagsQueryResult = await tagsQuery.exec();

  const result = Array.from(new Set(questionsQueryResult.concat(tagsQueryResult)));

  return result;
}


exports.search = async function (req, res) {
  let result = await getResult(req.params.searchQuery);
  res.send(result);
}

exports.searchNewest = async function (req, res) {
  let result = await getResult(req.params.searchQuery);
  result.sort((a, b) => b.ask_date_time - a.ask_date_time);
  res.send(result);
}

exports.searchActive = async function (req, res) {
  let result = await getResult(req.params.searchQuery);
  let resultAnswers = [];
  for (let q of result) {
    resultAnswers = resultAnswers.concat(q.answers);
  }
  resultAnswers.sort((a, b) => b.ans_date_time - a.ans_date_time);
  let activeQuestionsResult = [];
  for (let a of resultAnswers) {
    for (let q of result) {
      if (q.answers.includes(a)) {
        if (!activeQuestionsResult.includes(q)) {
          activeQuestionsResult.push(q);
        }
      }
    }
  }
  for (let q of result) {
    if (q.answers.length === 0 ) {
      activeQuestionsResult.push(q);
    }
  }
  res.send(activeQuestionsResult);
}

exports.searchUnanswered = async function (req, res) {
  let result = await getResult(req.params.searchQuery);
  result = result.filter(q => q.answers.length === 0);
  res.send(result);
}