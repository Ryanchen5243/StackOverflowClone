import { useContext, useEffect, useState } from "react";
import AppStateContext from "../context/AppStateContext";
import { getDateProfile } from "../utils/utils";
import ProfileQuestion from "./ProfileQuestion";
import axios from "axios";
import ProfileUser from "./ProfileUser";
export default function Profile() {
  const { profile } = useContext(AppStateContext);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function getUsers() {
      if (profile.isAdmin) {
        axios.get("http://localhost:8000/allUsers", {withCredentials: true}).then(res => {
          setUsers(res.data);
        }).catch(err => {
          console.log(err);
        });
      }
    }
    getUsers();
  }, [profile]);
  
  return (
    <>
      <div>
        <h4>Username: {profile.username}</h4>
        <h4>Member since: {getDateProfile(new Date(profile.date_joined))}</h4>
        <h4>Reputation: {profile.reputation}</h4>
        {!profile.isAdmin && <><h3>Questions asked:</h3>
        <div>
          {profile.questions_asked.map(q => <ProfileQuestion key={q._id} question={q}/>)}
        </div></>}
        {profile.isAdmin && <>
        <h3>Users:</h3>
        <div>
          {users.map(u => <ProfileUser setUsers={setUsers} user={u}/>)}
        </div>
        </>}
      </div>
    </>
  );
}