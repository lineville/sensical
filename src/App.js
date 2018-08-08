import React, { Component } from "react"
import logo from "./logo.svg"
import "./App.css"
import Auth from './components/Auth'
import fire from "./fire"

class App extends Component {
  render() {
    // fire.collection("fireUsers").add({ user: "zach" });
    // fire.collection("fireUsers").add({ user: "jessica" });
    // fire.collection("fireUsers").add({ user: "synuhe" });

    return (
      <div className="App">
        <Auth />
      </div>
    );
  }
}

export default App
