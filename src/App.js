import React, {Component} from 'react'
import logo from './logo.svg'
import Auth from './components/Auth'
import db from './firestore'
import Classroom from './components/Classroom'

class App extends Component {
  render() {
    // fire.collection("fireUsers").add({ user: "zach" });
    // fire.collection("fireUsers").add({ user: "jessica" });
    // fire.collection("fireUsers").add({ user: "synuhe" });

    return (
      <div className="App">
        <Auth />
        <Classroom />
      </div>
    )
  }
}

export default App
