// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
let userArgs = process.argv.slice(2);
const bcrypt = require("bcrypt");
const saltRounds = 10;



let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let User = require('./models/user');
let Comment = require('./models/comment');

let mongoose = require('mongoose');
let mongoDB = "mongodb://127.0.0.1:27017/fake_so"
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let tags = [];
let answers = [];
function tagCreate(name, num) {
  let tag = new Tag({ name: name, num_questions: num });
  return tag.save();
}

// 

async function makeAdmin(username, password) {
  const salt = await bcrypt.genSalt(saltRounds);
  const password_hash = await bcrypt.hash(password, salt);
  let admin = new User({
    username: "admin",
    password_hash: password_hash,
    email: username,
    reputation: 50,
    questions_asked: [],
    date_joined: new Date(),
    questions_voted_on: [],
    answers_voted_on: [],
    isAdmin: true,
    tags_created: [],
    questions_answered: []
  });
  return admin;
}

function answerCreate(text, ans_by, ans_date_time,num_votes,comments) {
  answerdetail = {text:text};
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
  answerdetail.num_votes = num_votes;
  answerdetail.comments = comments;
  let answer = new Answer(answerdetail);
  return answer.save();
}

function createComment(numVotes,text,user){
  let commentdtl = {
    num_votes: numVotes,
    text: text,
    date_created: new Date(),
    user: user
  }
  let cmt = new Comment(commentdtl)
  return cmt.save();
}

function questionCreate(title, summary, text, tags, answers, asked_by, ask_date_time, views,num_votes,comments) {
  qstndetail = {
    title: title,
    text: text,
    tags: tags,
    asked_by: asked_by,
    summary: summary,
    num_votes: num_votes,
    comments: comments
  }
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.num_views = views;

  let qstn = new Question(qstndetail);
  return qstn.save();
}

const populate = async () => {
  let au1 = await makeAdmin(userArgs[0], userArgs[1]);
  au1.save();


  let t1 = await tagCreate('react', 1);
  let t2 = await tagCreate('javascript', 11);
  let t3 = await tagCreate('android-studio', 10);
  let t4 = await tagCreate('shared-preferences', 10);
  let c1 = await createComment(33,"first comment",au1);
  let c2 = await createComment(3311,"second comment",au1);
  let c3 = await createComment(11, "this is the first comment of an answer", au1);
  let c4 = await createComment(234, "this is the second comment of an answer", au1);
  let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', au1, false,0,[c3, c4]);
  let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', au1, false,0,[]);
  let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', au1, false,0,[]);
  let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', au1, false,0,[]);
  let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', au1, false,0,[]);

  au1.tags_created.push(t1);
  au1.tags_created.push(t2);
  au1.tags_created.push(t2);
  au1.tags_created.push(t3);
  au1.tags_created.push(t4);

  au1 = await au1.save();

  let q1 = await questionCreate('Programmatically navigate using React router', 'summary of question 1', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [a1, a2], au1, false, 20,0,[c1]);
  let q2 = await questionCreate('android studio save string shared preference', 'summary of question 2', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], au1, false, 121,0,[c2]);

  
  au1.questions_asked.push(q1);
  au1.questions_asked.push(q2);
  au1.answers_created.push(a1);
  au1.answers_created.push(a2);
  au1.answers_created.push(a3);
  au1.answers_created.push(a4);
  au1.answers_created.push(a5);
  await au1.save();
  if(db) db.close();
  console.log('done');
}

populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if(db) db.close();
  });

console.log('processing ...');