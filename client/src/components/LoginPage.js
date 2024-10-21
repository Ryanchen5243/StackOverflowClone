import { useState, useContext } from "react";
import AppStateContext from "../context/AppStateContext";
import axios from "axios";
import RegisterButton from "./RegisterButton";

export default function LoginPage() {
  const { updateMainPage, setUser } = useContext(AppStateContext)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  return (
    <div id="main" className="main">
    <form action='#' onSubmit={async (e) => {
      e.preventDefault();
      await axios.post("http://localhost:8000/login",{
        email,
        password
      }, {withCredentials: true}).then(res => {
        setUser(res.data);
        updateMainPage("home");
      }).catch(err => {
        alert("wrong credentials");
        console.log("error from server: ");
        console.log(err);
      })
    }}>
      <h1>Email:</h1>
      <input type='text' onChange={e => {setEmail(e.target.value);}}></input>
      
      <h1>Password:</h1>
      <input type='password' onChange={e => {setPassword(e.target.value);}}></input>
      <br />
      <br />
      <button onClick={(e) => {
        e.preventDefault();
        setEmail("");
        setPassword("");
        updateMainPage("welcomePage");
      }} className="askQButton">Cancel</button>
      <button type="submit" className="askQButton">login</button>
      <RegisterButton />
    </form>
    </div>
  );
}