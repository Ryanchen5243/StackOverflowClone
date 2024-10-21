import { useContext } from "react";
import AppStateContext from "../context/AppStateContext";
import ProfileAnswer from "./ProfileAnswer";

export default function MyAnswers() {
  const { profile } = useContext(AppStateContext);
  return (
    <>
      <div>
        <h3>Answers Created:</h3>
        <div>
          {profile.answers_created.map(a => <ProfileAnswer key={a._id} answer={a}/>)}
        </div>
      </div>
    </>
  );
}