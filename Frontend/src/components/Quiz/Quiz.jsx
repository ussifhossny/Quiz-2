import React from "react";
import axios from "axios";
import classes from "./Quiz.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaXmark } from "react-icons/fa6";
import Answers from "../Answers/Answers";

export const Quiz = () => {
  const navigate = useNavigate();
  const [timerHandler, setTimerHandler] = useState(true);
  const [resultReady, setResultReady] = useState(false);
  const [answersData, setAnswersData] = useState([]);
  const [count, setCount] = useState(0);
  const [words, setWords] = useState([]);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(false);
  const [showQ, setShowQ] = useState(true);
  const [timeLeft, setTimeLeft] = useState(5);

  //Get List of random words from server
  async function getWords() {
    await axios
      .get("http://localhost:3000/words")
      .then((res) => {
        //Save List of words in Words State
        setWords(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Fetching the List of words once the page start
  useEffect(() => {
    getWords();
  }, []);

  //Timer For Displaying quiestions
  useEffect(() => {
    if (timerHandler) {
      var timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }

    if (timeLeft === -1 && count < words.length - 1) {
      setCount((prevCount) => prevCount + 1);
      setProgress(((count + 1) / words.length) * 100);
      setTimeLeft(5);
    }
    if (count === words.length - 1) {
      setTimeout(() => {
        setShowQ(false);
        setTimerHandler(false);
        setTimeLeft(5);
        setProgress(((count + 1) / words.length) * 100);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);
  //Calculate the student score
  function getScore(e) {
    e.preventDefault();
    if (words.length > 0) {
      if (e.target.value === words[count].pos) {
        setScore((prevScore) => prevScore + 1);
        setCorrect(true);
      } else {
        setCorrect(false);
      }
    }
  }

  function getAnswers(e) {
    e.preventDefault();
    if (words.length > 0) {
      setAnswersData([
        ...answersData,
        {
          name: words[count].word,
          answer: e.target.value,
        },
      ]);
    }
  }

  // Displaying Words one by one & Display loading
  const nextWord = (e) => {
    e.preventDefault();
    if (count < words.length - 1 && words.length > 0) {
      setCount((prevCount) => prevCount + 1);
      setProgress(((count + 1) / words.length) * 100);
      setTimeLeft(5);
    } else {
      setResultReady(true);
      setProgress(((count + 1) / words.length) * 100);
    }
  };
  const showResult = (e) => {
    e.preventDefault();
    navigate("/result/" + score);
  };

  //Remove result of each answer after displaying it
  function resetMsg(e) {
    e.preventDefault();
    setCorrectCount(1);
    setTimeout(() => {
      setCorrectCount(0);
    }, 300);
  }
  //Handler submit when click on btn answer
  function clickHandler(e) {
    e.preventDefault();
    nextWord(e);
    getScore(e);
    resetMsg(e);
    getAnswers(e);
  }

  const onReview = (e) => {
    e.preventDefault();
    setShowQ(false);
    setResultReady(false);
    setTimerHandler(false);
  };

  //Swiching between Colors of result
  const green = { color: "green" };
  const red = { color: "rgb(193, 4, 4)" };

  let msg = progress <= 90 ? "In Progress" : "Finished";

  return (
    <>
      <div className={classes.container}>
        {!resultReady && timerHandler && (
          <p className={classes.timer}>
            Time left: <span>{timeLeft}</span>
          </p>
        )}
        {words.length > 0 && showQ && !resultReady && (
          <h1>
            Word <span className={classes.word}>{words[count].word}</span> is a?
          </h1>
        )}

        {showQ && !resultReady && (
          <div className="btns">
            <button value={"noun"} onClick={clickHandler}>
              Noun
            </button>
            <button value={"adjective"} onClick={clickHandler}>
              Adjective
            </button>
            <button value={"verb"} onClick={clickHandler}>
              Verb
            </button>
            <button value={"adverb"} onClick={clickHandler}>
              Adverb
            </button>
          </div>
        )}

        <div className={classes.q}>
          {!showQ && <Answers data={answersData} />}
        </div>
        {/* Choose which text will displaying */}
        {correctCount > 0 && correct && (
          <p style={green}>
            <FaCheck className={classes.icon} />
          </p>
        )}
        {correctCount > 0 && !correct && (
          <p style={red}>
            <FaXmark className={classes.icon} />
          </p>
        )}
        {showQ && (
          <h2>
            {msg} <span>{progress}%</span>
          </h2>
        )}

        {resultReady && (
          <button className={classes.review} onClick={onReview}>
            Review Answers
          </button>
        )}
        {!showQ && (
          <button className={classes.review} onClick={showResult}>
            Submit
          </button>
        )}
      </div>
    </>
  );
};

export default Quiz;
