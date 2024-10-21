import { useContext } from "react";
import AppStateContext from "../context/AppStateContext";
import axios from "axios";

export default function ProfileUser({ setUsers, user }) {
  const { setProfile, updatePage } = useContext(AppStateContext);

  async function handleClickTitle() {
    setProfile(user);
    updatePage("profile");
  }
  async function handleClickDelete() {
    await axios.post("http://localhost:8000/deleteUser", {id: user._id}, {withCredentials: true}).then(res => {
      setUsers(res.data);
      updatePage("profile");
    }).catch(err => {
      console.error(err);
    });
  }
  return (
    <div style={{display: "block"}}>
      <button className="titleBtn" type="button" onClick={handleClickTitle} style={{fontWeight: "bold"}}>
        {user.username}
      </button>
      <button onClick={handleClickDelete}>Delete</button>
    </div>
  );
}