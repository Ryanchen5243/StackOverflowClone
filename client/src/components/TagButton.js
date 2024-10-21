import axios from 'axios';
import { useContext } from 'react';
import AppStateContext from '../context/AppStateContext';

export default function TagButton({ tag }) {
  const { updatePage, setAllQuestions, setSearchQuery } = useContext(AppStateContext);

  async function handleClick() {
    await axios.get(`http://localhost:8000/search/[${tag.name}]`).then(res => {
      setSearchQuery(`[${tag.name}]`);
      res.data.forEach(question => question.ask_date_time = new Date(question.ask_date_time));
      setAllQuestions(res.data);
    }).catch(err => {
      setAllQuestions([]);
    });
    updatePage("searchResults");
  }
  
  return (
    <button onClick={handleClick}>{ tag.name }</button>
  );
}