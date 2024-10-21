import { useState, useContext } from "react";
import AppStateContext from "../context/AppStateContext";
import axios from "axios";
import LoginButton from "./LoginButton";

export default function RegisterPage() {
  const { updateMainPage } = useContext(AppStateContext)

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerification, setPasswordVerification] = useState('');
  
  return (
    <div id="main" className="main">
    <form action='#' onSubmit={async (e) => {
      e.preventDefault();
      if (username === "") {
        alert("Please enter username");
        return;
      }
      if (email === "") {
        alert("Please enter email");
        return;
      }
      if (password === "") {
        alert("Please enter password");
        return;
      }
      if (passwordVerification === "") {
        alert("Please enter password verification");
        return;
      }
      if (password !== passwordVerification) {
        alert("password and password verification are not the same");
        return;
      }
      if (!(/^\S+@\S+\.\S+$/gm).test(email)) {
        alert("invalid email format");
        return;
      }
      // store user details in request body and send to server
      await axios.post("http://localhost:8000/register",{
        username,
        email,
        password,
        passwordVerification
      }).then(res => {
        setUsername("");
        setEmail("");
        setPassword("");
        setPasswordVerification("");
        updateMainPage("loginPage");
      }).catch(err => {
        alert("Error registering, check inputs again");
      })
    }}>
      <h1>Username:</h1>
      <input type='text' onChange={e => {setUsername(e.target.value);}}></input>
      
      <h1>Email:</h1>
      <input type='text' onChange={e => {setEmail(e.target.value);}}></input>
      
      <h1>Password:</h1>
      <input type='password' onChange={e => {setPassword(e.target.value);}}></input>
      
      <h1>Password Verification: </h1>
      <input type='password' onChange={e => {setPasswordVerification(e.target.value);}}></input>
      <br />
      <br />
      <button onClick={(e) => {
        e.preventDefault();
        setUsername("");
        setEmail("");
        setPassword("");
        setPasswordVerification("");
        updateMainPage("welcomePage");
      }} className="askQButton">cancel</button>
      <button type="submit" className="askQButton">sign up</button>
      <LoginButton />
    </form>
    </div>
  );
}