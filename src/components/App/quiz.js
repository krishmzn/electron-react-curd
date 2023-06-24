import React, { useState } from 'react';
import quizData from '../../../gamedata/gamedata.json';
import './task.css'
import './quiz.css'

function QuizApp() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)

    function nextQuestion() {
        // Get user answer
        const userAnswer = document.querySelector('input[name="choice"]:checked').value;
        setUserAnswers([...userAnswers, userAnswer]);

        setCurrentPage(currentPage+1)

        // Move to next question or show submit button
        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            document.getElementById("next-button").style.display = "none";
            document.getElementById("submit-button").style.display = "block";
        }
    }

    function previousQuestion() {
        if (currentPage > 1) {
            setCurrentQuestion(currentQuestion - 1)
        }
    }

    function submitQuiz() {
        let score = 0;

        // Calculate score
        for (let i = 0; i < quizData.length; i++) {
            if (userAnswers[i] == quizData[i].answer) {
                score++;
            }
        }

        // Display score
        document.getElementById("quiz-container").innerHTML = `<p>You scored ${score} out of ${quizData.length}!</p>`;
    }

    return (
        <section id="quiz-container">
            <main>
                <header>
                    <h2 id="question">{quizData[currentQuestion].question}</h2>
                    <p>
                        Question: {currentPage}/{quizData.length}
                    </p>
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
                <button id="next-button" onClick={nextQuestion}>Next</button>
                <button id="submit-button" onClick={submitQuiz} style={{ display: 'none' }}>Submit</button>
            </main>
        </section>
    );
}

export default QuizApp;
