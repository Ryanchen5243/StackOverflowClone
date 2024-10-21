import axios from 'axios';
import { useContext } from 'react';
import AppStateContext from '../context/AppStateContext';

export default function SideNavBar(){
  const { updatePage, setAllQuestions, setAllTags, isLoggedIn, setProfile } = useContext(AppStateContext);

  async function handleClickQuestions() {
    await axios.get("http://localhost:8000/allQuestions", {withCredentials: true}).then(res => {
      res.data.forEach(question => question.ask_date_time = new Date(question.ask_date_time));
      setAllQuestions(res.data);
    }).catch(err => console.log(err));
    updatePage("allQuestions");
  }
  
  async function handleClickTags() {
    await axios.get("http://localhost:8000/tags", {withCredentials: true}).then(res => {
      setAllTags(res.data);
  }).catch(err => console.log(err));
  updatePage("tags");
  }

  async function handleClickProfile() {
    await axios.get("http://localhost:8000/getUserInformation", {withCredentials: true}).then(res => {
      setProfile(res.data);
      updatePage("profile");
    }).catch(err => {
      console.log(err);
    });
  }

  async function handleClickMyTags() {
    await axios.get("http://localhost:8000/getUserInformation", {withCredentials: true}).then(res => {
      setProfile(res.data);
      updatePage("myTags");
    }).catch(err => {
      console.log(err);
    });
  }

  async function handleClickMyAnswers() {
    await axios.get("http://localhost:8000/getUserInformation", {withCredentials: true}).then(res => {
      setProfile(res.data);
      updatePage("myAnswers");
    }).catch(err => {
      console.log(err);
    });
  }
  return (
  <section id="side-nav-bar">
  <div id="questionsPage" href="" onClick={ handleClickQuestions }>Questions</div>
  <div id ="tagsPage" href="" onClick={ handleClickTags }>Tags</div>
  {isLoggedIn && <div onClick={handleClickProfile}>Profile</div>}
  {isLoggedIn && <div onClick={handleClickMyTags}>My Tags</div>}
  {isLoggedIn && <div onClick={handleClickMyAnswers}>My Answers</div>}

  </section>
  );
}