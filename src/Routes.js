import React from 'react'
import CodeEditor from './components/CodeEditor'
import {Switch, Route} from 'react-router-dom'
import Canvas from './components/Canvas'
import Profile from './components/Profile'
import ClassroomContext from './components/ClassroomContext'
import HomePage from './components/HomePage'
import Signup from './components/Signup'
import Login from './components/Login'
import QuestionnaireStepper from './components/QuestionnaireStepper'
import {withAuth} from 'fireview'

const Routes = props => {
  const isLoggedIn = props._user
  return (
    <div>
      <Switch>
        {/* Routes anyone can get to */}
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        {/* Routes that only logged in users can access */}
        {isLoggedIn && (
          <Switch>
            <Route exact path="/profile" component={Profile} />
            <Route
              exact
              path="/questionnaire"
              component={QuestionnaireStepper}
            />
            <Route exact path="/whiteboard" component={Canvas} />
            <Route
              path="/classroom/:classroomId"
              component={ClassroomContext}
            />
            <Route path="/codeEditor/:codeEditorId" component={CodeEditor} />
            {/* <Route exact path="/video" component={VideoChat} /> */}
            <Route path="/whiteboards/:whiteboardId" component={Canvas} />
          </Switch>
        )}
        {/* Fallback to home page */}
        <Route path="/" render={() => <HomePage popupOpen={true} />} />
      </Switch>
    </div>
  )
}

export default withAuth(Routes)
