import React, {Component} from 'react'
import logo from './logo.svg'
import Auth from './components/Auth'
import db from './firestore'
import CodeEditor from './components/CodeEditor'
import Canvas from './components/whiteboard/Canvas'
import Classroom from './components/Classroom';

class App extends Component {
  render() {
    db.collection("fireUsers").add({ user: "testUser" });

    return (
      <div className="App">
        <Auth />
        <Classroom />
        {/* <Canvas /> */}
      </div>
    )
  }
}

export default App
