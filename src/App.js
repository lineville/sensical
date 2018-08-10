import React from 'react'
import Auth from './components/Auth'
import CodeEditor from './components/CodeEditor'
import {Router, Switch, Route} from 'react-router-dom'
import history from './history'
import Classroom from './components/Classroom'

const App = () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={Classroom} />
      <Route exact path="/auth" component={Auth} />
    </Switch>
  </Router>
)

export default App
