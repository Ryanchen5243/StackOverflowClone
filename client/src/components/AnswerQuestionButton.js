import { useContext } from 'react';
import AppStateContext from '../context/AppStateContext';

export default function AnswerQuestionButton() {
  const { updatePage } = useContext(AppStateContext);
  
  function handleClick() {
    updatePage("answerQuestionForm");
  }
  return (
    <button onClick = {handleClick} id="ansQuestionBtn">Answer Question</button>
  );
}