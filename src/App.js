import React from 'react'
import Auth from './components/Auth'
import CodeEditor from './components/CodeEditor'
import {Router, Switch, Route} from 'react-router-dom'
import history from './history'
import Canvas from './components/Canvas'
import Profile from './components/Profile'
import Classroom from './components/Classroom'
import HomePage from './components/HomePage'

const App = () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/auth" component={Auth} />
      <Route exact path="/profile" component={Profile} />
      <Route path="/classRooms/:classRoomId" component={Classroom} />
      <Route path="/codeEditor/:codeEditorId" component={CodeEditor} />
      <Route path="/whiteboards/:whiteboardId" component={Canvas} />
    </Switch>
  </Router>
)

export default App
