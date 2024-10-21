import Header from './Header';
import Main from './Main';
import AllQuestions from './AllQuestions';
import AskQuestionForm from './AskQuestionForm';
import AnswerQuestionForm from './AnswerQuestionForm';
import QuestionView from './QuestionView';
import SearchResults from './SearchResults';
import Tags from './Tags';
import WelcomePage from './WelcomePage';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import { useState, useEffect } from 'react'
import AppStateContext from '../context/AppStateContext';
import axios from 'axios';
import Profile from './Profile';
import QuestionEditForm from './QuestionEditForm';
import MyTags from './MyTags';
import TagEditForm from './TagEditForm';
import MyAnswers from './MyAnswers';
import AnswerEditForm from './AnswerEditForm';


export default function FakeStackOverflow() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(undefined);
  const [questionEdit, setQuestionEdit] = useState(undefined);
  const [answerEdit, setAnswerEdit] = useState(undefined);
  const [profile, setProfile] = useState(undefined);
  const [page, setPage] = useState("allQuestions")
  const [question, setQuestion] = useState(undefined);
  const [allQuestions, setAllQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [tagEdit, setTagEdit] = useState(undefined);

  // const [allMyTags, setAllMyTags] = useState([]);
  const [mainPage, setMainPage] = useState("welcomePage"); // this is the page the is either welcome page, login, or register, or main (fakestackoverflow)

  // useEffect(() => {
  //   async function fetchData() {
  //     await axios.get("http://localhost:8000/allQuestions", {withCredentials: true}).then(res => {
  //       res.data.forEach(question => question.ask_date_time = new Date(question.ask_date_time));
  //       setAllQuestions(res.data);
  //     }).catch(err => console.log(err));
  //   }
  //   fetchData();
  // }, []);
  async function checkSession() {
    await axios.get("http://localhost:8000/checkSession", {withCredentials: true}).then(res => {
      setIsLoggedIn(true);
      setUser(res.data);
    }).catch(err => {
      setIsLoggedIn(false)
      setUser(undefined);
    });
  }

  useEffect(() => {
    async function firstRender() {
      await checkSession();
    }
   firstRender();
  }, []);

  async function updatePage(newPage) {
    await checkSession();
    setPage(newPage);
  }

  async function updateMainPage(newMainPage) {
    await checkSession();
    setMainPage(newMainPage);
  }

  async function updateQuestion(newQuestion) {
    await axios.post("http://localhost:8000/increaseQuestionViewCount", newQuestion).then(res => {
      res.data[0].ask_date_time = new Date(res.data[0].ask_date_time);
      const index = allQuestions.indexOf(newQuestion);
      allQuestions[index] = res.data[0];
      setQuestion(res.data[0]);
    });
  }

  function addAnswerToQuestion(answer) {
    setQuestion(prevQuestion => ({
      ...prevQuestion,
      answers: [answer, ...prevQuestion.answers],
    }));
  }

  const pageTable = new Map(); // map for pname -> component
  pageTable.set("allQuestions", <AllQuestions />);
  pageTable.set("askQuestionForm", <AskQuestionForm />);
  pageTable.set("questionView", <QuestionView />);
  pageTable.set("answerQuestionForm", <AnswerQuestionForm />);
  pageTable.set("tags", <Tags />);
  pageTable.set("searchResults", <SearchResults />);
  pageTable.set("profile", <Profile />);
  pageTable.set("questionEditForm", <QuestionEditForm />);
  pageTable.set("myTags", <MyTags />);
  pageTable.set("tagEditForm", <TagEditForm />)
  pageTable.set("myAnswers", <MyAnswers />);
  pageTable.set("answerEditForm", <AnswerEditForm />);

  const mainPageTable = new Map(); // map for main pages
  mainPageTable.set("home", <Main />);
  mainPageTable.set("welcomePage", <WelcomePage />);
  mainPageTable.set("registerPage", <RegisterPage />);
  mainPageTable.set("loginPage", <LoginPage />);

  const appStateContextValues = {
    pageComponent: pageTable.get(page),

    isLoggedIn,
    setIsLoggedIn,

    user,
    setUser,

    questionEdit,
    setQuestionEdit,

    answerEdit,
    setAnswerEdit,

    profile,
    setProfile,

    setPage,

    question,
    setQuestion,

    allQuestions,
    setAllQuestions,

    searchQuery,
    setSearchQuery,

    allTags,
    setAllTags,

    tagEdit,
    setTagEdit,

    updatePage,
    updateQuestion,
    addAnswerToQuestion,

    mainPageComponent: mainPageTable.get(mainPage),
    setMainPage,
    updateMainPage,
    mainPage
  };

  return (
    <AppStateContext.Provider value={appStateContextValues}>
      <Header />
      {appStateContextValues.mainPageComponent}
    </AppStateContext.Provider>
  );
}