import { useState, useContext } from 'react';
import AppStateContext from '../context/AppStateContext';
import axios from 'axios';
import { hasInvalidLink } from '../utils/utils';

export default function AnswerQuestionForm() {
  const [text, setText] = useState("");

  const { question, updatePage, addAnswerToQuestion, user } = useContext(AppStateContext);

  return (
    <form action="#" id="answer-form" style={{display: "block"}} onSubmit={async (e) => {
      e.preventDefault();
      if (text === "") {
        alert("Please fill all the blanks in order to post an answer");
        return;
      }
      if (hasInvalidLink(text)) {
        alert("Invalid link notation please follow the format [text](https:// or http:// 'link')");
        return;
      }
      const newAObject = {
        question_id: question._id,
        answer: {
          text: text,
          ans_by: user,
          ans_date_time: new Date()
        }
      };
      await axios.post("http://localhost:8000/addAnswerToQuestion", newAObject, {withCredentials: true}).then(res => {
        addAnswerToQuestion(res.data);
      }).catch(err => console.log(err));
      setText("");
      updatePage("questionView");
    }}>
  <div id="form-group2">
    <h1>Answer Text*</h1>
    <i>Add details</i>
    <br />
    <label htmlFor="atext"></label>
    <br />
    <textarea id="atext" name="atext" rows="5" cols="40" required="" onChange={e => setText(e.target.value)}></textarea>
    <br />
  </div>
  <div id="form-group3">
    <button id="postABtn" type="submit">Post Answer</button>
    <p>* indicates mandatory fields</p>
  </div>
</form>
  );
}