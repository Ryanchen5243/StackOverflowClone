import { useContext } from "react";
import AppStateContext from "../context/AppStateContext";
export default function LoginButton() {
  const { updateMainPage } = useContext(AppStateContext);
  function handleClick(e) {
    e.preventDefault();
    updateMainPage("loginPage");
  }
  return (
    <button onClick={handleClick} className="askQButton">
      Login
    </button>
  );
}