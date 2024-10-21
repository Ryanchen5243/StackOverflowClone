import { useState, useContext } from 'react';
import AppStateContext from '../context/AppStateContext';
import { hasInvalidLink } from '../utils/utils';
import axios from 'axios'


export default function AskQuestionForm() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [summary, setSummary] = useState("");

  const { setAllQuestions, updatePage, user, allTags } = useContext(AppStateContext);
  return (
    <form action="#" id="question-form" style={{display: "block"}} onSubmit={async (e) => {
      e.preventDefault();
      if (title === "" || text === "" || tags === "" || summary === "") {
        alert("Please fill all the blanks in order to post a question");
        return;
      }
      if (title.trim().length > 50) {
        alert("Title must no more than 50 characters");
        return;
      }
      if (summary.trim().length > 140) {
        alert("Summary must no more than 140 characters");
      }
      if (hasInvalidLink(text)) {
        alert("Invalid link notation please follow the format [text](https:// or http:// 'link')");
        return;
      }
      if (tags.trim().split(/\s+/).length > 5) {
        alert("The number of tags should not be more than 5");
        return;
      } else {
        for (let t of tags.trim().split(" ")) {
          if (t.length > 10) {
            alert("The length of each tag should not be more than 10 characters");
            return;
          }
          if ((!allTags.some(obj => obj.name === t)) && user.reputation < 50) {
            alert("Your user's reputation is less than 50 and cannot create a new tag");
            return;
          }
        }
      }

      let uniqueTags = tags.trim().split(/\s+/);
      uniqueTags = [...new Set(uniqueTags)];

      // send a post request to the server with question details
      const newQObject = {
        title: title,
        summary: summary,
        text: text,
        tags: uniqueTags,
        username: user,
        ask_date_time: Date.now
      };
      await axios.post("http://localhost:8000/addNewQuestion",newQObject, {withCredentials: true}).then(res => {
        // for (let q of res.data) q.ask_date_time = new Date(q.ask_date_time);
        // setAllQuestions(res.data);
        res.data.ask_date_time = new Date(res.data.ask_date_time);
        setAllQuestions(prevQuestions => [res.data, ...prevQuestions]);
      }).catch(err => {
        alert("Could not post a question");
      });

      // clears input
      setTitle("");
      setText("");
      setTags("");
      setSummary("");
      //setUsername("");

      updatePage("allQuestions");
    }}>
      <div id="form-group1">
        <h1>Question Title*</h1>
        <i>Limit title to 50 characters or less</i>
        <br />
        <label htmlFor="qtitle"></label>
        <input type="text" id="qtitle" name="qtitle" required="" onChange={e => setTitle(e.target.value)}/>
      </div>
      <div id="form-group2">
        <h1>Question Summary*</h1>
        <i>Add details</i>
        <br />
        <label htmlFor="qtext"></label>
        <br />
        <textarea id="qtext" name="qtext" rows="5" cols="40" required="" onChange={e => setSummary(e.target.value)}>
        </textarea>
        <br />
      </div>
      <div id="form-group3">
        <h1>Question Text*</h1>
        <i>Add details</i>
        <br />
        <label htmlFor="qtext"></label>
        <br />
        <textarea id="qtext" name="qtext" rows="5" cols="40" required="" onChange={e => setText(e.target.value)}>
        </textarea>
        <br />
      </div>
      <div id="form-group4">
        <h1>Tags*</h1>
        <i>Add keywords separated by whitespace</i>
        <label htmlFor="kwords"></label>
        <br />
        <input type="text" id="kwords" name="kwords" required="" onChange={e => setTags(e.target.value)}/>
      </div>
      <br />
      <div id="form-group5">
        <button id="postQBtn" type="submit">Post Question</button>
        <p>* indicates mandatory fields</p>
      </div>
    </form>
  );
}