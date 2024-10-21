import Question from './Question';
import AskQuestionButton from './AskQuestionButton';
import FilterButtons from "./FilterButtons";
import axios from 'axios';
import { useContext } from 'react';
import AppStateContext from '../context/AppStateContext';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './myCarousel.css'

export default function SearchResults() {
  const { allQuestions, setAllQuestions, searchQuery, isLoggedIn } = useContext(AppStateContext);
  
  async function filterNewest () {
    await axios.get(`http://localhost:8000/search/${searchQuery}/newest`).then(res => {
        res.data.forEach(question => question.ask_date_time = new Date(question.ask_date_time));
        setAllQuestions(res.data);
      }).catch(err => {
        setAllQuestions([]);
      });
  }

  async function filterActive () {
    await axios.get(`http://localhost:8000/search/${searchQuery}/active`).then(res => {
      res.data.forEach(question => question.ask_date_time = new Date(question.ask_date_time));
      setAllQuestions(res.data);
    }).catch(err => {
      setAllQuestions([]);
    });
  }

  async function filterUnanswered () {
    await axios.get(`http://localhost:8000/search/${searchQuery}/unanswered`).then(res => {
    res.data.forEach(question => question.ask_date_time = new Date(question.ask_date_time));
    setAllQuestions(res.data);
  }).catch(err => {
    setAllQuestions([]);
  });
  }

  const listQuestions = allQuestions.map(question => 
  <Question key = {question._id} question = { question } tags = { question.tags }/>
  );
  const groupOfLists = [];
  for (let i = 0; i < listQuestions.length; i += 5) {
    groupOfLists.push(listQuestions.slice(i, i + 5));
  }

  return (
    <div id="search_result_page" style={{display: "block"}}>
      <div id="searchResultsOverview">
        <div id="searchResultsOverview_over1">
          <h2>Search Results</h2>
          {isLoggedIn && <AskQuestionButton/>}
        </div>
        <div id="searchResultsOverview_over2">
          <span id="searchresults_numquestions">
            {listQuestions.length === 0 ? "No Questions Found": (listQuestions.length === 1 ? `${listQuestions.length} question` : `${listQuestions.length} questions`)}
          </span>
          <span id="searchresults_buttons3">
            <FilterButtons filterNewest = {filterNewest} filterActive = {filterActive} filterUnanswered = {filterUnanswered}/>
          </span>
        </div>
      </div>
      <div id="search_result_container">
      <Carousel interval={null} variant='dark'>
      {groupOfLists.map((questions, index) => (
        <Carousel.Item key={index} >
            {questions}
        </Carousel.Item>
       ))}
      </Carousel>
      </div>
    </div>
  );
}