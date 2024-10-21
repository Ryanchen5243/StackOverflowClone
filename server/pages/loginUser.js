const User = require("../models/user"); // users collection
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

exports.loginUser = async function(req, res) {
  const userDtls = req.body;
  // get email/password from req body
  const providedEmail = userDtls["email"];
  const providedPassword = userDtls["password"];
  
  // verify all fields were provided, if not, send error status with message
  if (!providedEmail || !providedPassword){
    return res.status(401).json({ error: "missing email or password" });
  }
  
  // get existing user with email, if not exist, send error status with message
  const existingUser = await User.findOne({ email: providedEmail });
  if(!existingUser) {
    console.log("user couldn't be found");
    return res.status(401).json({error: "user not found"});
  }

  // check hashed provided password against previously provided hashed password, if not same,
  // send error status with message
  const pwCorrect = await bcrypt.compare(providedPassword,existingUser.password_hash);
  if(!pwCorrect){
    return res.status(401).json({error:"wrong email or password"});
  }

  //console.log("successful login");
  // sign JWT using SECRET and embed user id inside
  // attach token to response in http-only cookie
  // send success status and embed necessary user info
  // const token = jwt.sign({userId: existingUser._id}, privateKey, signOptions);

  req.session.user = userDtls.email;
  res.send({name: existingUser.username, reputation: existingUser.reputation});


  // console.log("before send")
  // res.cookie("token",token, {
  //   httpOnly: true, sameSite:"Lax", secure: true, maxAge: (1000 * 60 * 60)
  // }).send()
}