import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import fire from "./fire";

class App extends Component {
  render() {
    // fire.collection("fireUsers").add({ user: "zach" });
    // fire.collection("fireUsers").add({ user: "jessica" });
    // fire.collection("fireUsers").add({ user: "synuhe" });

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
