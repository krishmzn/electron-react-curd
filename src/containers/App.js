import React, { Component } from 'react';

import '../assets/css/App.css';

import HelloWorld from '../components/App/HelloWorld';

class App extends Component {
  render() {
    return (
      <body>
        <HelloWorld />
      </body>
    );
  }
}

export default App;
