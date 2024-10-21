import { useState, useContext } from 'react';
import AppStateContext from '../context/AppStateContext';
import { hasInvalidLink } from '../utils/utils';
import axios from 'axios'


export default function QuestionEditForm() {
  const { setQuestion, setAllQuestions, updatePage, user, allTags, questionEdit, allQuestions } = useContext(AppStateContext);
  const [title, setTitle] = useState(questionEdit.title);
  const [text, setText] = useState(questionEdit.text);
  const [tags, setTags] = useState((questionEdit.tags.map(t => t.name)).join(" "));
  const [summary, setSummary] = useState(questionEdit.summary);

  async function handleClickDelete() {
    await axios.post("http://localhost:8000/deleteQuestion", {id: questionEdit._id}, {withCredentials: true}).then(res => {
      setTitle("");
      setText("");
      setTags("");
      setSummary("");
      res.data.forEach(question => question.ask_date_time = new Date(question.ask_date_time));
      setAllQuestions(res.data);
      updatePage("allQuestions")
    }).catch(err => {
      console.error(err);
    })
  }
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
        id: questionEdit._id,
        title: title,
        summary: summary,
        text: text,
        tags: uniqueTags,
        username: user,
      };
      await axios.post("http://localhost:8000/modifyQuestion",newQObject, {withCredentials: true}).then(res => {
        res.data[0].ask_date_time = new Date(res.data[0].ask_date_time);
      const index = allQuestions.indexOf(res.data[0]);
      allQuestions[index] = res.data[0];
      setQuestion(res.data[0]);
      }).catch(err => {
        alert("Could not post a question");
      });

      // clears input
      setTitle("");
      setText("");
      setTags("");
      setSummary("");
      //setUsername("");

      updatePage("questionView");
    }}>
      <div id="form-group1">
        <h1>Question Title*</h1>
        <i>Limit title to 50 characters or less</i>
        <br />
        <label htmlFor="qtitle"></label>
        <input type="text" id="qtitle" name="qtitle" required="" value={title} onChange={e => setTitle(e.target.value)}/>
      </div>
      <div id="form-group2">
        <h1>Question Summary*</h1>
        <i>Add details</i>
        <br />
        <label htmlFor="qtext"></label>
        <br />
        <textarea id="qtext" name="qtext" rows="5" cols="40" required="" value={summary} onChange={e => setSummary(e.target.value)}>
        </textarea>
        <br />
      </div>
      <div id="form-group3">
        <h1>Question Text*</h1>
        <i>Add details</i>
        <br />
        <label htmlFor="qtext"></label>
        <br />
        <textarea id="qtext" name="qtext" rows="5" cols="40" required="" value={text} onChange={e => setText(e.target.value)}>
        </textarea>
        <br />
      </div>
      <div id="form-group4">
        <h1>Tags*</h1>
        <i>Add keywords separated by whitespace</i>
        <label htmlFor="kwords"></label>
        <br />
        <input type="text" id="kwords" name="kwords" required="" value={tags} onChange={e => setTags(e.target.value)}/>
      </div>
      <br />
      <div id="form-group5">
        <button id="postQBtn" type="submit">Post Question</button>
        <button type="button" onClick={handleClickDelete}>Delete Question</button>
        <p>* indicates mandatory fields</p>
      </div>
    </form>
  );
}