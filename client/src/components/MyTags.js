import { useContext } from 'react';
import AskQuestionButton from './AskQuestionButton';
import AppStateContext from '../context/AppStateContext';

export default function MyTags() {
  const { updatePage, setTagEdit, profile, isLoggedIn } = useContext(AppStateContext);

  async function handleClickTagName(tag) {
    setTagEdit(tag);
    updatePage("tagEditForm");
  }
  
  let tagsList = profile.tags_created.map(tag => 
  <div className = "tagPageTagDiv" key = {tag._id} onClick={() => {handleClickTagName(tag)}}>
    <button type="button" className="tagBtn">
      {tag.name}
    </button>
    <p>
      {tag.num_questions} questions
    </p>
  </div>
  );

  return (
    <>
      <div id="tagPageHeader" style={{display: "flex"}}>
        <h2 id="tagPageTotalDisplayText">{tagsList.length} Tags</h2>
        <h2>My Tags</h2>
        {isLoggedIn && <AskQuestionButton/>}
      </div>
      <div id="tagsContainer" style={{display: "flex"}}>
        { tagsList }
      </div>
    </>
  );
}