import { useContext } from "react";
import AppStateContext from "../context/AppStateContext";
export default function RegisterButton() {
  const { updateMainPage } = useContext(AppStateContext);
  function handleClick(e) {
    e.preventDefault();
    updateMainPage("registerPage");
  }
  return (
    <button onClick={handleClick} className="askQButton">
      Register
    </button>
  );
}