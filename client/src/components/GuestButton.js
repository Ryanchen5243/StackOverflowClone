import { useContext } from "react";
import AppStateContext from "../context/AppStateContext";
export default function GuestButton() {
  const { updateMainPage } = useContext(AppStateContext);
  function handleClick(e) {
    e.preventDefault();
    updateMainPage("home");
  }
  return (
    <button onClick={handleClick} className="askQButton">
      Guest
    </button>
  );
}