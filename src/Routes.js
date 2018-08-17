import React from 'react'
import CodeEditor from './components/CodeEditor'
import {Switch, Route} from 'react-router-dom'
import Canvas from './components/Canvas'
import Profile from './components/Profile'
import ClassroomContext from './components/ClassroomContext'
import HomePage from './components/HomePage'
import Signup from './components/Signup'
import Login from './components/Login'
import {withAuth} from 'fireview'
// import VideoChat from './components/Video'
import VideoComponent from './components/VideoComponent'

const Routes = props => {
  const isLoggedIn = props._user
  return (
    <div>
      <Switch>
        {/* Routes anyone can get to */}
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/twilio" component={VideoComponent} />
        {/* Routes that only logged in users can access */}
        {isLoggedIn && (
          <Switch>
            <Route exact path="/profile" component={Profile} />
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
        <Route exact path="/" component={HomePage} />
      </Switch>
    </div>
  )
}

export default withAuth(Routes)
