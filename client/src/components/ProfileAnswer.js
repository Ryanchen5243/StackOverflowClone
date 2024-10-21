import { useContext } from "react";
import AppStateContext from "../context/AppStateContext";

export default function ProfileAnswer({ answer }) {
  const { setAnswerEdit, updatePage } = useContext(AppStateContext);

  async function handleClickTitle() {
    setAnswerEdit(answer);
    updatePage("answerEditForm");
  }
  return (
    <>
      <button className="titleBtn" type="button" onClick={handleClickTitle} style={{display: "block", fontWeight: "bold"}}>
        {answer.text}
      </button>
    </>
  );
}