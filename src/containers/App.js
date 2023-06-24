import React, { Component } from 'react';

import '../assets/css/App.css';

// import Task from '../components/App/task';
import QuizApp from '../components/App/quiz';

class App extends Component {
  render() {
    return (
      <body>
        {/* <Task /> */}
        <QuizApp />
      </body>
    );
  }
}

export default App;
