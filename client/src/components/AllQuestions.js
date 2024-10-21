import Question from './Question';
import FilterButtons from './FilterButtons';
import AskQuestionButton from './AskQuestionButton';
import AppStateContext from '../context/AppStateContext';
import { useContext } from 'react';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './myCarousel.css'

export default function AllQuestions() {
  const { allQuestions, setAllQuestions, isLoggedIn } = useContext(AppStateContext);
  
  const listQuestions = allQuestions.map(question => <Question key = {question._id} question = { question } tags = { question.tags }/>);
  const groupOfLists = [];
  for (let i = 0; i < listQuestions.length; i += 5) {
    groupOfLists.push(listQuestions.slice(i, i + 5));
  }
  async function filterNewest () {
    await axios.get("http://localhost:8000/newestQuestions").then(res => {
      res.data.forEach(question => question.ask_date_time = new Date(question.ask_date_time));
      setAllQuestions(res.data);
    }).catch(err => console.log(err));
  }
  async function filterActive () {
    await axios.get("http://localhost:8000/activeQuestions").then(res => {
      res.data.forEach(question => question.ask_date_time = new Date(question.ask_date_time));
      setAllQuestions(res.data);
    }).catch(err => console.log(err));
  }
  async function filterUnanswered () {
    await axios.get("http://localhost:8000/unansweredQuestions").then(res => {
      res.data.forEach(question => question.ask_date_time = new Date(question.ask_date_time));
      setAllQuestions(res.data);
    }).catch(err => console.log(err));
  }
  return (
    <>
    <div id = "overviewsection">
      <div id = "overview1">
        <h2 id = "allQuestionsHeader">All Questions</h2>
        {isLoggedIn && <AskQuestionButton/>}
      </div>
      <div id = "overview2">
        <span id = "numOfQuestions">{ listQuestions.length } questions</span>
        <FilterButtons filterNewest = {filterNewest} filterActive = {filterActive} filterUnanswered = {filterUnanswered}/>
      </div>
    </div>
    <Carousel interval={null} variant='dark'>
      {groupOfLists.map((questions, index) => (
        <Carousel.Item key={index} >
            {questions}
        </Carousel.Item>
       ))}
    </Carousel>
    </>
  );
}
