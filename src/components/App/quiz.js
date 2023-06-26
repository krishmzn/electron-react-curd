import React, { useState } from 'react';
import quizData from '../../../gamedata/gamedata.json';
import './task.css'
import './quiz.css'

function QuizApp() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    function nextQuestion() {
        // Get user answer
        const userAnswer = document.querySelector('input[name="choice"]:checked').value;

        setUserAnswers([...userAnswers, userAnswer]);

        setCurrentPage(currentPage + 1)

        // Move to next question or show submit button
        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            document.getElementById("next-button").style.display = "none";
            document.getElementById("choices").style.display = "none";
            document.getElementById("question").style.display = "none";
            document.getElementById("question").style.display = "none";

            document.getElementById("submit-button").style.display = "block";
        }
    }

    function startOver() {
        console.log('Startover Clicked')
        setCurrentPage(1)
        setCurrentQuestion(0)
        setUserAnswers([])
        setShowResult(false)
        setScore(0)
        document.getElementById("next-button").style.display = "block";
        document.getElementById("submit-button").style.display = "none";
    }

    function previousQuestion() {
        if (currentPage > 1) {
            // actually takes to previous page
            setCurrentPage(currentPage - 1)
            setCurrentQuestion(currentQuestion - 1)
        }
        
        // shows the hidden item
        document.getElementById("next-button").style.display = "block";
        document.getElementById("choices").style.display = "block";
        document.getElementById("question").style.display = "block";
        document.getElementById("question").style.display = "block";
    }

    function submitQuiz() {
        console.log('Submit Clicked')
        let newScore = 0;
        // Calculate score
        for (let i = 0; i < quizData.length; i++) {
            if (userAnswers[i] == quizData[i].answer) {
                newScore++;
            }
        }

        setScore(newScore);
        setShowResult(true)
    }

    return (
        <section id="quiz-container">
            {showResult == false ? (
                <main>
                    <header>
                        <h2 id="question">{quizData[currentQuestion].question}</h2>
                        {currentPage == quizData.length + 1 ? (
                            <h2>Click submit to see your results</h2>
                        )
                            : (
                                <p>Question: {currentPage}/{quizData.length}</p>
                            )
                        }
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
                        <button id="prev-button" onClick={previousQuestion}>Back</button>
                        <button id="next-button" onClick={nextQuestion}>Next</button>

                        <button id="submit-button" onClick={submitQuiz} style={{ display: 'none' }}>Submit</button>
                    </aside>
                </main>

            ) : (

                <main>
                    <div>
                        <h2>You scored {score} out of {quizData.length}!</h2>
                        <button onClick={startOver} >Start over again</button>
                    </div>
                </main>

            )
            }
        </section>
    );
}

export default QuizApp;
