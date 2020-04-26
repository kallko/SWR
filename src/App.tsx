import React, { Component } from "react";
import logo from './logo.svg';
import "./App.css";
type appStateType = { test: string };

export class App extends Component<{}, appStateType> {
  constructor(props: appStateType) {
    super(props);
    this.state = { test: "Start" };
  }
  componentDidMount() {
    (async () => {
      const response = await fetch("http://localhost:1976/api");
      const data = await response.json();
      this.setState({ test: data.test });
    })();
  }
  render() {
    return (
      <div className="App">
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
            Learn React !!! {this.state.test}
          </a>
        </header>
      </div>
    );
  }
}

export default App;
