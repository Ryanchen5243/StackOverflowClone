import { useContext } from 'react';
import AskQuestionButton from './AskQuestionButton';
import axios from 'axios';
import AppStateContext from '../context/AppStateContext';

export default function Tags() {
  const { updatePage, setSearchQuery, setAllQuestions, allTags, isLoggedIn } = useContext(AppStateContext);

  async function handleClickTagName(tag) {
    await axios.get(`http://localhost:8000/search/[${tag.name}]`).then(res => {
      setSearchQuery(`[${tag.name}]`);
      res.data.forEach(question => question.ask_date_time = new Date(question.ask_date_time));
      setAllQuestions(res.data);
    }).catch(err => {
      setAllQuestions([]);
    });
    updatePage("searchResults");
  }
  
  let tagsList = allTags.map(tag => 
  <div className = "tagPageTagDiv" key = {tag._id} onClick={() => {handleClickTagName(tag)}}>
    <button type="button" className="tagBtn">
      {tag.name}
    </button>
    <p>
      {tag.num_questions} questions
    </p>
  </div>);

  return (
    <>
      <div id="tagPageHeader" style={{display: "flex"}}>
        <h2 id="tagPageTotalDisplayText">{tagsList.length} Tags</h2>
        <h2>All Tags</h2>
        {isLoggedIn && <AskQuestionButton/>}
      </div>
      <div id="tagsContainer" style={{display: "flex"}}>
        { tagsList }
      </div>
    </>
  );
}