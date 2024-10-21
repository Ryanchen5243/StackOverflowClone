import { useContext } from "react";
import AppStateContext from "../context/AppStateContext";
import axios from "axios";
export default function LogoutButton() {
  const { updateMainPage, updatePage, user } = useContext(AppStateContext);
  async function handleClick(e) {
    e.preventDefault();
    await axios.post("http://localhost:8000/logout", {user: user}, {withCredentials: true}).then(res => {
      updateMainPage("welcomePage");
      updatePage("allQuestions");
    }).catch(err => {
      console.log(err);
    })
  }
  return (
    <button onClick={handleClick} className="askQButton">
      logout
    </button>
  );
}