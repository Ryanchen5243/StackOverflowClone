import { useContext } from "react";
import AppStateContext from "../context/AppStateContext";

export default function ProfileQuestion({ question }) {
  const { setQuestionEdit, updatePage } = useContext(AppStateContext);

  async function handleClickTitle() {
    setQuestionEdit(question);
    updatePage("questionEditForm");
  }
  return (
    <>
      <button className="titleBtn" type="button" onClick={handleClickTitle} style={{display: "block", fontWeight: "bold"}}>
        {question.title}
      </button>
    </>
  );
}