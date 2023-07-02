import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import Task from './components/task';
import QuizApp from './components/quiz';

function Home() {
  return (
    <div className='container'>
      <main>
      <h2>Welcome! Which app would you like to use?</h2>
        <p><Link to="/task">CRUD App</Link></p>
        <p><Link to="/quiz">Quiz App</Link></p>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<QuizApp />} />
        <Route path="/task" element={<Task />} />
      </Routes>
    </Router>
  );
}
