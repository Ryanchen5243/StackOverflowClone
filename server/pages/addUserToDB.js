const Users = require("../models/user"); // the user collection
const bcrypt = require("bcrypt");
const saltRounds = 10;
// helper function to create new user


exports.addUserToDB = async function(res,newUserDetails){
  // verify password == password verification

  if (newUserDetails["password"] != newUserDetails["passwordVerification"]){
    return res.status(400).json({ error: "Passwords do not match" });
  }
  try {
  const salt = await bcrypt.genSalt(saltRounds);
  const pwHash = await bcrypt.hash(newUserDetails.password, salt);
  const userDtls = {
    username: newUserDetails.username,
    password_hash: pwHash,
    email: newUserDetails.email,
    reputation: 0,
    questions_asked: [],
    date_joined: new Date(),
    questions_voted_on: [],
    answers_voted_on: [],
    isAdmin: false,
    tags_created: [],
    questions_answered: [],
    answers_created: []
  };
  const createNewUser = new Users(userDtls);
  await createNewUser.save();
  return res.status(200).json({message: "User created"});
} catch (err) {
  return res.send(err);
}
}