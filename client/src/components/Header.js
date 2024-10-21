import { useState, useContext } from 'react';
import AppStateContext from '../context/AppStateContext';
import axios from 'axios';
import LogoutButton from './LogoutButton';
import RegisterButton from './RegisterButton';
import LoginButton from './LoginButton';

export default function Header(){
  const [searchText, setSearchText] = useState("");
  const { setAllQuestions, updatePage, setSearchQuery, mainPage, isLoggedIn } = useContext(AppStateContext);

  async function handleKeyPress(e) {
    if (e.key === 'Enter') {
      await axios.get(`http://localhost:8000/search/${searchText}`).then(res => {
        setSearchQuery(searchText);
        res.data.forEach(question => question.ask_date_time = new Date(question.ask_date_time));
        setAllQuestions(res.data);
      }).catch(err => {
        setAllQuestions([]);
      });
      updatePage("searchResults");
    }
  }
  return (
    <div id="header" className="header">
      {
        (!isLoggedIn && 
        (mainPage !== 'welcomePage') && 
        (mainPage !== 'loginPage') &&
        (mainPage !== 'registerPage')) && <RegisterButton />
      }
      {
        (!isLoggedIn && 
        (mainPage !== 'welcomePage') && 
        (mainPage !== 'loginPage') &&
        (mainPage !== 'registerPage')) && <LoginButton />
      }

      {(mainPage === 'home') && <span id="dummyHead"></span>}
      <h1 id="title">Fake Stack Overflow</h1>
      {
        (mainPage === 'home') &&
        <input type="text" 
        id="search" 
        name="search" 
        placeholder = "Search ..." 
        onChange={e => setSearchText(e.target.value)} 
        onKeyDown={ handleKeyPress }/>
      }
      {isLoggedIn && <LogoutButton />}
    </div>
  );
}