import React from 'react'
import Auth from './components/Auth'
import CodeEditor from './components/CodeEditor'
import {Router, Switch, Route} from 'react-router-dom'
import history from './history'
import Canvas from './components/whiteboard/Canvas'

const App = () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={Auth} />
      <Route path="/codeEditor" component={CodeEditor} />
      <Route path="/whiteboard" component={Canvas} />
    </Switch>
  </Router>
)

export default App
