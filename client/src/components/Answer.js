import { getDate } from '../utils/utils';
import CompiledText from './CompiledText';
import Comment from './Comment';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './myCarousel.css';
import UpvoteButton from './UpvoteButton';
import DownvoteButton from './DownvoteButton';
import AppStateContext from '../context/AppStateContext';
import { useContext, useState } from 'react';
import axios from 'axios';

export default function Answer({ answer }) {
  const [commentText, setCommentText] = useState("");
  const { isLoggedIn, question, allQuestions, setQuestion } = useContext(AppStateContext);
  async function handleKeyPress(e) {
    if (e.key === 'Enter') {
      await axios.post("http://localhost:8000/addCommentToAnswer", {
        comment: {
          text: commentText,
          date_created: new Date()
        },
        question_id: question._id,
        answer_id: answer._id
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
  const comments = answer.comments;
  const listComments = comments.map(c => <Comment key={c._id} comment={c}/>);
  const groupOfListsComments = [];
  for (let i = 0; i < listComments.length; i += 3) {
    groupOfListsComments.push(listComments.slice(i, i + 3));
  }
  return ( <>
    <div className = "answerContainer">
      <CompiledText text={answer.text} className={"answerText"}/>
      <div className = "ansDetails">
        { answer.ans_by.username } answered { getDate(new Date(answer.ans_date_time)) }<br />votes: {answer.num_votes}<br />{isLoggedIn && <><UpvoteButton id={answer._id}/><DownvoteButton id={answer._id}/></>}
      </div>
    </div>
    <div style={{fontSize: "10px"}}>
    {isLoggedIn && <input type="text" 
        id="comment" 
        name="comment" 
        placeholder = "Add comment ..." 
        onChange={e => setCommentText(e.target.value)} 
        onKeyDown={ handleKeyPress }/>}
    </div>
    <div style={{marginLeft: "100px", marginRight: "100px", fontSize: "12px"}}>
    <Carousel interval={null} variant='dark'>
      {groupOfListsComments.map((comments, index) => (
        <Carousel.Item key={index} >
            {comments}
        </Carousel.Item>
       ))}
    </Carousel>
    </div>
    </>
  );
}