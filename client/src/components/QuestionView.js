import AskQuestionButton from './AskQuestionButton';
import Answer from './Answer';
import Comment from './Comment';
import AnswerQuestionButton from './AnswerQuestionButton';
import { getDate } from '../utils/utils';
import CompiledText from './CompiledText';
import { useContext, useState } from 'react';
import AppStateContext from '../context/AppStateContext';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './myCarousel.css'
import UpvoteButton from './UpvoteButton';
import DownvoteButton from './DownvoteButton';
import axios from 'axios';

export default function QuestionView() {
  const { question, isLoggedIn, allQuestions, setQuestion , user} = useContext(AppStateContext);
  const [commentText, setCommentText] = useState("");
  async function handleKeyPress(e) {
    if (e.key === 'Enter') {
      if (commentText.length > 140) {
        alert("comments cannot be more than 140 characters");
        return;
      }
      if (user.reputation < 50) {
        alert("Users with reputation below 50 cannot comment");
        return;
      }
      await axios.post("http://localhost:8000/addCommentToQuestion", {
        comment: {
          text: commentText,
          date_created: new Date()
        },
        question_id: question._id
      }, {withCredentials: true}).then(res => {
        //setSearchQuery(searchText);
        //res.data.forEach(question => question.ask_date_time = new Date(question.ask_date_time));
        //setAllQuestions(res.data);
        //console.log(res);
        res.data[0].ask_date_time = new Date(res.data[0].ask_date_time);
        const index = allQuestions.indexOf(res.data[0]);
        allQuestions[index] = res.data[0];
        setQuestion(res.data[0]);
        setCommentText("");
        e.target.value = "";
      }).catch(err => {
        //setAllQuestions([]);
        //console.log(err);
      });
      //updatePage("searchResults");
    }
  }
  if (question === undefined) {
    return <></>;
  }
  const answers = question.answers;
  const listAnswers = answers.map(answer => <Answer key = { answer._id } answer = { answer }/>);
  const groupOfLists = [];
  for (let i = 0; i < listAnswers.length; i += 5) {
    groupOfLists.push(listAnswers.slice(i, i + 5));
  }
  const comments = question.comments;
  const listComments = comments.map(c => <Comment key={c._id} comment={c}/>);
  const groupOfListsComments = [];
  for (let i = 0; i < listComments.length; i += 3) {
    groupOfListsComments.push(listComments.slice(i, i + 3));
  }
  return (
    <div id="question-view-page" style={ {display: "block"} }>
  <div id="questionViewPageHeader">
    <div id="qviewheadersub1">
      <h2 id="questionViewPageTitle" style={{alignSelf: "end"}}>{ question.title }</h2>
      {isLoggedIn && <AskQuestionButton/>}
    </div>
    <br />
    <br />
    <div id="qviewheadersub2">
      <h5 id="questionViewPageQuestionViews" >{question.answers.length} answers<br />{ question.num_views } views<br />
      {question.num_votes} votes</h5>
      <CompiledText text={question.text} className={""} />
      <p id="questionViewAskedByAndWhen" style={{textAlign: "right"}}>&nbsp;&nbsp;{ question.asked_by.username } asked { getDate(question.ask_date_time) }</p>
      <div style={{fontSize: "10px", display:"block"}}>
      {
        isLoggedIn &&
        <>
          <UpvoteButton id={question._id}/>
          <DownvoteButton id={question._id}/>
        </>
      }
      </div>
    </div>
    <div style={{width: "30%"}}>
    Tags: {question.tags.map(t => t.name + ", ")}
    </div>
    <div>
    {isLoggedIn && <input type="text" 
        id="comment" 
        name="comment" 
        placeholder = "Add comment ..." 
        onChange={e => setCommentText(e.target.value)} 
        onKeyDown={ handleKeyPress }/>}
    </div>
    <div style={{fontSize: "12px"}}>
    <Carousel interval={null} variant='dark'>
      {groupOfListsComments.map((comments, index) => (
        <Carousel.Item key={index} >
            {comments}
        </Carousel.Item>
       ))}
    </Carousel>
    </div>
    <br />
    <br />
  </div>
  <div id="questionAnswersList">
  <Carousel interval={null} variant='dark'>
      {groupOfLists.map((answers, index) => (
        <Carousel.Item key={index} >
            {answers}
        </Carousel.Item>
       ))}
    </Carousel>
  </div>
  {isLoggedIn && <AnswerQuestionButton/>}
</div>
  );
}