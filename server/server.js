// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const app = express();
const cors = require('cors')
const port = 8000;
// const path = require("path");
app.use(express.urlencoded({ extended: false }));


app.use(cors({
  origin: "http://localhost:3000",
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  credentials: true
}));
app.use(express.json());
// JWT authentication init start
//const fs = require("fs");
// const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
app.use(cookieParser());
app.use(session({
  secret: "my super secret code to guess haha",
  cookie: {httpOnly: true, sameSite:"Lax", secure: false, maxAge: (1000 * 60 * 60)},
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl: 'mongodb://127.0.0.1:27017/session'})
}));

// import some wrappers for fetching/posting data
const Questions = require("./pages/fetchQuestions")
const Tags = require("./pages/fetchAllTags")
const CreateQuestion = require("./pages/addNewQuestion")
const IncreaseQuestionViewCount = require("./pages/increaseQuestionViewCount");
const AddAnswerToQuestion = require("./pages/addAnswerToQuestion");
const Search = require("./pages/search");
const Vote = require("./pages/vote");
const AddComment = require("./pages/addComment");
const Profile = require("./pages/profile");
const ModifyQuestion = require("./pages/modifyQuestion");
const ModifyTag = require("./pages/modifyTag");
const ModifyAnswer = require("./pages/modifyAnswer");

// import some wrappers for 
const AddUser = require("./pages/addUserToDB");
const loginUserController = require("./pages/loginUser");

//key pair generated online
// const privateKey = fs.readFileSync(path.join(__dirname, "private.key"),"utf-8");
// const publicKey = fs.readFileSync(path.join(__dirname, "public.key"),"utf-8");
// const signOptions = {
//   algorithm: "RS256"
// };
// const verifyOptions = {
//   algorithm: ["RS256"]
// }
//end JWT authentication init

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

let mongoose = require('mongoose');
let mongoDB = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', function() {
  console.log('Connected to database');
});

app.get("/allQuestions", (req,res) => {
  // wrapper for res.send
  try {
    //const verdict = jwt.verify(req.cookies.token, publicKey);
    Questions.getAllQuestions(res);
  } catch(err) {
    res.status(200).send();
  }
});

// newest questions
app.get("/newestQuestions",(req,res) => {
  // wrapper for res.send
  Questions.getNewestQuestions(res);
});

// filter active btn
app.get("/activeQuestions",(req,res)=> {
  Questions.getActiveQuestions(res);
});

app.get("/unansweredQuestions", (req, res) => {
  Questions.getUnansweredQuestions(res);
});


app.get("/tags",(req,res) => {
  // wrapper for res.send
  Tags.getAllTags(res);
});

// triggered when user clicks on post question button
// client with event handler will do something like
// axios.post("http://localhost:8000/addNewQuestion",newQuestion)
app.post("/addNewQuestion",(req,res) => {  
  // let us assume the body is provided of the following form 
  /*
  {
  "title": "Question Title",
  "text": "Question Text",
  "tags": ["tag1", "tag2", "tag3"],
  "username": "username"
  }
  note that answers we can init as empty, ask_date_time as new date, views as 0
   */
  CreateQuestion.addNewQuestion(res,req.body, req.session.user);
});


app.post("/increaseQuestionViewCount", (req, res) => {
  IncreaseQuestionViewCount.increaseQuestionViewCount(req, res);
});

app.post("/addAnswerToQuestion", (req, res) => {
  AddAnswerToQuestion.addAnswerToQuestion(req, res);
});

app.get("/search/:searchQuery", (req, res) => {
  Search.search(req, res);
});

app.get("/search/:searchQuery/newest", (req, res) => {
  Search.searchNewest(req, res);
});

app.get("/search/:searchQuery/active", (req, res) => {
  Search.searchActive(req, res);
});

app.get("/search/:searchQuery/unanswered", (req, res) => {
  Search.searchUnanswered(req, res);
});

app.post("/register",(req,res) => {
  let userDetails = req.body;
  AddUser.addUserToDB(res,userDetails);
});

app.post("/login",(req,res) => {
  loginUserController.loginUser(req, res);
});


app.post("/logout", (req, res) => {
  //console.log(req.session);
  if (req.session) {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      res.status(500).send("internal server error");
    } else {
      res.send("logout successfully");
    }
  });
}
});


app.get("/checkSession", async (req,res) => {
  if (req.session && req.session.user) {
    const Users = require("./models/user");
    const u = await Users.findOne({email: req.session.user}).exec();
    if (u) res.send({name: u.username, reputation: u.reputation});
    else res.send(401)
  }
  else res.send(401);
});

app.post("/upvote", async (req, res) => {
  Vote.upvote(req, res);
});

app.post("/downvote", (req, res) => {
  Vote.downvote(req, res);
})

app.post("/addCommentToQuestion", (req, res) => {
  AddComment.toQuestion(req, res);
});

app.post("/addCommentToAnswer", (req, res) => {
  AddComment.toAnswer(req, res);
});

app.get("/getUserInformation", (req, res) => {
  Profile.getUserInformation(req, res)
});

app.post("/deleteQuestion", (req, res) => {
  ModifyQuestion.delete(req.body.id, res);
});

app.post("/modifyQuestion", (req, res) => {
  ModifyQuestion.modifyQuestion(res, req.body, req.session.user);
});

app.post("/deleteTag", (req, res) => {
  ModifyTag.delete(req, res);
});

app.post("/modifyTag", (req, res) => {
  ModifyTag.modify(req, res);
});

app.post("/deleteAnswer", (req, res) => {
  ModifyAnswer.delete(req, res);
});

app.post("/modifyAnswer", (req, res) => {
  ModifyAnswer.modify(req, res);
});

app.get("/allUsers", (req, res) => {
  Profile.getAllUsers(req, res);
});

app.post("/deleteUser", (req, res) => {
  Profile.deleteUser(req, res);
});