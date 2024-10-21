import LoginButton from "./LoginButton";
import RegisterButton from "./RegisterButton";
import GuestButton from "./GuestButton";
import AppStateContext from "../context/AppStateContext";
import { useContext } from "react";

export default function WelcomePage() {
  const { isLoggedIn, updateMainPage } = useContext(AppStateContext);
  if (isLoggedIn) {
    updateMainPage("home");
    return;
  }
  return (
    <div style={{display: "block", textAlign: "center"}} id="main" className="main">
      <h1>Welcome to FakeStackOverflow</h1>
      <RegisterButton />
      <LoginButton />
      <GuestButton />
    </div>
  );
}