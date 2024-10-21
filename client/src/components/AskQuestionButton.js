import { useContext } from 'react';
import AppStateContext from '../context/AppStateContext';

export default function AskQuestionButton() {
  const { updatePage } = useContext(AppStateContext);

  function handleClick() {
    updatePage("askQuestionForm");
  }

  return (
    <button onClick = { handleClick } className = "askQButton">
      Ask Question
    </button>
  );
}