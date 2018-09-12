import React, {Component} from 'react'
import {withStyles} from '@material-ui/core/styles'
import {Snackbar, Button} from '@material-ui/core/'
import {Notification} from '../imports'
import styles from '../styles/HomePageStyles'

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      popupOpen: false
    }
  }

  componentDidMount() {
    this.setState({
      popupOpen: this.props.popupOpen
    })
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({popupOpen: false})
  }

  signupPush = () => {
    this.props.history.push('/signup')
  }

  render() {
    const {classes} = this.props
    return (
      <div style={{marginTop: '50px'}}>
        <div className="slidelist">
          <div className={classes.infoCard}>
            <p>
              Let Knowledge Grow
              <br />
              <br />
              <i>
                Your classroom should be a reflection of your personal learning
                style. So we made classrooms customizable.
              </i>
              <br />
              <br />
              Sign up now to get started using a sensical room.
              <br />
            </p>
            <Button onClick={this.signupPush} className={classes.button}>
              Sign Up
            </Button>
          </div>

          <div className="slide open">
            <span className="image1" />
          </div>

          <div className="bottomButton">
            <ul>
              <li className="circle">
                <i className="fa fa-circle-o" />
              </li>
              <li className="circle">
                <i className="fa fa-circle-o" />
              </li>
              <li className="circle">
                <i className="fa fa-circle-o" />
              </li>
              <li className="circle">
                <i className="fa fa-circle-o" />
              </li>
              <li className="circle select">
                <i className="fa fa-circle-o" />
              </li>
            </ul>
          </div>

          <div className={classes.info}>
            <h1>About Sensical</h1>
            <p>
              My application was inspired by the changing educational landscape.
              As students, we oftentimes found ourselves wanting to study
              together, but traffic, weather, and the L train get in the way of
              meeting up. In these cases, we would have to use Skype to video
              chat, repl.it to write out code and Google Docs to take notes.
              These tools are great on their own but they become cumbersome when
              used together.
            </p>
            <p>
              This is why we created sensical. Sensical rooms provide students
              with a modularized real-time collaborative learning environment.
              Sensical allows students to build a virtual classroom where they
              can use built-in learning modules to work and study together on a
              variety of subjects.
            </p>
            <p>
              Come checkout the source code and its creators on{' '}
              <a href="https://github.com/lineville/sensical" alt="github">
                GitHub
              </a>{' '}
              or if you are interested in some of my other work and are looking
              to hire a fullstack or front end developer, checkout my website{' '}
              <a href="https://lineville.github.io" alt="github">
                https://lineville.github.io
              </a>
              .
            </p>
          </div>
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={this.state.popupOpen}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          <Notification
            onClose={this.handleClose}
            variant="info"
            message="You are not logged in!"
          />
        </Snackbar>
      </div>
    )
  }
}

export default withStyles(styles)(HomePage)
