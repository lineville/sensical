import React, {Component} from 'react'
import logo from './logo.svg'
import Auth from './components/Auth'
import db from './firestore'
import CodeEditor from './components/CodeEditor'
import Canvas from './components/whiteboard/Canvas'

class App extends Component {
  render() {
    // fire.collection("fireUsers").add({ user: "zach" });
    // fire.collection("fireUsers").add({ user: "jessica" });
    // fire.collection("fireUsers").add({ user: "synuhe" });

    return (
      <div className="App">
        <Auth />
        <Canvas />
      </div>
    )
  }
}

export default App
