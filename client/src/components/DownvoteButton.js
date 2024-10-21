import axios from "axios";
import AppStateContext from "../context/AppStateContext";
import { useContext } from "react";

export default function DownvoteButton({ id }) {
  const { user, setAllQuestions, setQuestion, question } = useContext(AppStateContext);
  async function handleClick() {
    if (user.reputation < 50) {
      alert("Your user's reputation is less than 50 and cannot vote");
      return;
    }
    await axios.post("http://localhost:8000/downvote", {id: id, qId: question._id}).then(res => {
      res.data[0].ask_date_time = new Date(res.data[0].ask_date_time);
      setAllQuestions(prevQuestions => [res.data[0], ...prevQuestions]);
      setQuestion(res.data[0]);
    }).catch(err => {
      alert("network error")
    });
  }
  return (
    <button onClick={handleClick}>downvote</button>
  );
}