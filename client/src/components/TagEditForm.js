import { useContext, useState } from "react";
import AppStateContext from "../context/AppStateContext";
import axios from "axios";

export default function TagEditForm() {
  const { tagEdit, setProfile, updatePage } = useContext(AppStateContext);
  const [tagName, setTagName] = useState(tagEdit.name);

  async function handleClickDelete() {
    await axios.post("http://localhost:8000/deleteTag", {id: tagEdit._id}, {withCredentials: true}).then(res => {
      setProfile(res.data);
      updatePage("myTags");
    }).catch(err => {
      console.error("cannot delete tag");
    });
  }

  return (
    <form action="#" style={{display: "block"}} onSubmit={async (e) => {
      e.preventDefault();
      await axios.post("http://localhost:8000/modifyTag", {id: tagEdit._id, name: tagName}, {withCredentials: true}).then(res => {
        setProfile(res.data);
        updatePage("myTags");
      }).catch(err => {
        console.error("cannot delete tag");
      });
    }}>
      <div id="form-group1">
        <h1>Tag Name*</h1>
        <input type="text" id="tname" name="tname" required="" value={tagName} onChange={e => setTagName(e.target.value)}/>
      </div>
      <div id="form-group2">
        <button id="postQBtn" type="submit">Save Tag</button>
        <button type="button" onClick={handleClickDelete}>Delete Tag</button>
        <p>* indicates mandatory fields</p>
      </div>
    </form>
  );
}