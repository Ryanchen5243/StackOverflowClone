import { useState, useContext } from 'react';
import AppStateContext from '../context/AppStateContext';
import axios from 'axios';
import { hasInvalidLink } from '../utils/utils';

export default function AnswerEditForm() {
  const { updatePage, answerEdit, setProfile } = useContext(AppStateContext);
  const [text, setText] = useState(answerEdit.text);
  async function handleClickDelete() {
    await axios.post("http://localhost:8000/deleteAnswer", {id: answerEdit._id}, {withCredentials: true}).then(res => {
      setProfile(res.data);
      updatePage("myAnswers");
    }).catch(err => {
      console.error(err);
    });
  }
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
        id: answerEdit._id,
        text: text
      };
      await axios.post("http://localhost:8000/modifyAnswer", newAObject, {withCredentials: true}).then(res => {
        setProfile(res.data);
        updatePage("myAnswers");
      }).catch(err => console.log(err));
      setText("");
    }}>
  <div id="form-group2">
    <h1>Answer Text*</h1>
    <i>Add details</i>
    <br />
    <label htmlFor="atext"></label>
    <br />
    <textarea id="atext" value={text} name="atext" rows="5" cols="40" required="" onChange={e => setText(e.target.value)}></textarea>
    <br />
  </div>
  <div id="form-group3">
    <button id="postABtn" type="submit">Post Answer</button>
    <button type="button" onClick={handleClickDelete}>Delete Answer</button>
    <p>* indicates mandatory fields</p>
  </div>
</form>
  );
}