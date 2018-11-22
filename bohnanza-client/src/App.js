import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Homepage from './homepage.jsx';
import { Button } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/css/bootstrap-theme.min.css';

class App extends Component {

  componentDidMount() {
    console.log('yo');
    fetch('/whee')
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });
  }


  render() {
    return (
      <div className="App">
        <Button bsStyle="danger">Success</Button>

        <Homepage></Homepage>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
