import React from 'react'
import Signup from './components/Signup'
import CodeEditor from './components/CodeEditor'
import {Router, Switch, Route} from 'react-router-dom'
import history from './history'
import Canvas from './components/Canvas'
import Profile from './components/Profile'
import Classroom from './components/Classroom'
import HomePage from './components/HomePage'
import Login from './components/Login'

const App = () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/profile" component={Profile} />
      <Route path="/classRooms/:classRoomId" component={Classroom} />
      <Route path="/codeEditor/:codeEditorId" component={CodeEditor} />
      <Route path="/whiteboards/:whiteboardId" component={Canvas} />
    </Switch>
  </Router>
)

export default App
