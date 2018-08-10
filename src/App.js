import React from 'react'
import Auth from './components/Auth'
import CodeEditor from './components/CodeEditor'
import ClassRoom from './components/Classroom'
import {Router, Switch, Route} from 'react-router-dom'
import history from './history'
import HomePage from './components/HomePage'
import Profile from './components/Profile'

const App = () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/auth" component={Auth} />
      <Route exact path="/profile" component={Profile} />
      <Route path="/classRoom" component={ClassRoom} />
      <Route path="/codeEditor" component={CodeEditor} />
    </Switch>
  </Router>
)

export default App
