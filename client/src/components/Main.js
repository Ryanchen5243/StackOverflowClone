import SideNavBar from './SideNavBar'
import Mainsection from './Mainsection'
import AppStateContext from '../context/AppStateContext';
import { useContext, useEffect } from 'react';
import axios from 'axios';

export default function Main(){
  const { setAllQuestions, setAllTags } = useContext(AppStateContext);
  useEffect(() => {
    async function fetchData() {
      await axios.get("http://localhost:8000/allQuestions", {withCredentials: true}).then(res => {
        res.data.forEach(question => question.ask_date_time = new Date(question.ask_date_time));
        setAllQuestions(res.data);
      }).catch(err => console.log(err));
    }
    fetchData();
  }, [setAllQuestions]);
  useEffect(() => {
    async function fetchTags() {
      await axios.get("http://localhost:8000/tags", {withCredentials: true}).then(res => {
        setAllTags(res.data);
    }).catch(err => console.log(err));
    }
    fetchTags();
  }, [setAllTags]);

  return (
  <div id="main" className="main">
    <SideNavBar />
    <Mainsection />
  </div>
  );
}