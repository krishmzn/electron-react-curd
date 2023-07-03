import React, { useEffect, useState } from 'react';
import quizData from '../../../gamedata/gamedata.json';
import './task.module.css';
import styles from './quiz.module.css';

import { useNavigate } from 'react-router-dom';

function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // Timer
  const defaultTimer = 15;
  const [timer, setTimer] = useState(defaultTimer);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((timer) => timer - 1);
    }, 1000);

    if (currentQuestion <= quizData.length) {
      if (timer === 0) {
        setTimer(defaultTimer);
        nextQuestion();

        if (currentQuestion > quizData.length - 2) {
          clearInterval(interval); // stop the interval
          submitQuiz();
        }
      }
    }

    return () => clearInterval(interval);
  }, [timer]);

  // navigation
  const navigate = useNavigate();

  function handleBackClick() {
    navigate(-1);
  }
  // navigation

  function nextQuestion() {
    setTimer(defaultTimer);

    // Get user answer
    const inputElement = document.querySelector(
      'input[name="choice"]:checked'
    ) as HTMLInputElement;
    const userAnswer = inputElement ? inputElement.value : '0';

    console.log(userAnswer);

    setUserAnswers([...userAnswers, userAnswer]);

    setCurrentPage(currentPage + 1);

    // Move to next question or show submit button
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
    //  else {
    //   document.getElementById('next-button').style.display = 'none';
    //   document.getElementById('choices').style.display = 'none';
    //   document.getElementById('question').style.display = 'none';
    //   document.getElementById('question').style.display = 'none';

    //   document.getElementById('submit-button').style.display = 'block';
    // }
  }

  function startOver() {
    console.log('Startover Clicked');
    location.reload();
  }

  function previousQuestion() {
    if (currentPage > 1) {
      // actually takes to previous page
      setCurrentPage(currentPage - 1);
      setCurrentQuestion(currentQuestion - 1);
    }

    // shows the hidden item
    document.getElementById('next-button').style.display = 'block';
    document.getElementById('choices').style.display = 'block';
    document.getElementById('question').style.display = 'block';
    document.getElementById('question').style.display = 'block';
  }

  function submitQuiz() {
    // console.log('Submit Clicked');
    let newScore = 0;
    // Calculate score
    for (let i = 0; i < quizData.length; i++) {
      if (userAnswers[i] == quizData[i].answer) {
        newScore++;
      }
    }

    setScore(newScore);
    setShowResult(true);
    // console.log('submit complete');
  }

  return (
    <section id="quiz-container" className={styles.container}>
      <a onClick={handleBackClick} className="back">
        <strong>&larr;</strong>
      </a>

      {showResult == false ? (
        <main className="quiz-box">
          <span className={styles.timer}><p>{timer}</p></span>
          <header>
            <h2 id="question">{quizData[currentQuestion].question}</h2>
            {currentPage == quizData.length + 1 ? (
              <h2>Click submit to see your results</h2>
            ) : (
              <p>
                Question: {currentPage}/{quizData.length}
              </p>
            )}
          </header>
          <div id="choices">
            {quizData[currentQuestion].choices.map((choice, index) => (
              <label key={index}>
                <input type="radio" name="choice" value={index} />
                {choice}
                <br />
              </label>
            ))}
          </div>
          {/* <button id="next-button" onClick={previousQuestion}>back</button> */}
          <aside>
            {/* <button
              id="prev-button"
              onClick={previousQuestion}
              className={styles.prev}
            >
              Back
            </button> */}

            {currentQuestion === quizData.length - 1 ? (
              <button
                id="submit-button"
                className={styles.submit}
                onClick={submitQuiz}
              >
                Submit
              </button>
            ) : (
              <button
                id="next-button"
                onClick={nextQuestion}
                className={styles.next}
              >
                Next
              </button>
            )}
          </aside>
        </main>
      ) : (
        <main>
          <div>
            <h2>
              You scored {score} out of {quizData.length}!
            </h2>
            <button onClick={startOver}>Start over again</button>
          </div>
        </main>
      )}
    </section>
  );
}

export default QuizApp;
