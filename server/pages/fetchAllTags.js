let Tags = require("../models/tags");
let Questions = require("../models/questions");
exports.getAllTags = async function (res) {
  try {
    // query the model to fetch all the tags
    const allTagsResult = await Tags.find({}).lean().exec();
    // send the result back to client
    // for (let t of allTagsResult) {
    //   const query = Questions.find({tags: {$in : [t]}});
    //   const result = await query.exec();
    //   t.numOfQuestions = result.length;
    // }
    res.send(allTagsResult);
  } catch(err) {
    console.log("Could not get all tags" + err);
  }
}