import React, {Component} from 'react'
import {withStyles} from '@material-ui/core/styles'
import {Snackbar, Button} from '@material-ui/core/'
import Notification from './Notification'
import styles from '../styles/HomePageStyles'

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      popupOpen: false,
    }
  }

  componentDidMount() {
    this.setState({
      popupOpen: this.props.popupOpen,
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
            <h2>Sensical</h2>
            <h3>Code, Learn and Chat all in one place.</h3>
            <p>
              Coding involves using a lot of tools all at once. Switching
              between dozens of programs can be overwhelming especially when
              trying to collaborate with others. No installing software, no
              commands to run, just jump into a coding room solo or invite
              others, and you have a fully functional development setup to
              execute code while you video chat, or message friends. Using
              Sensical, you can setup a classroom where you and a friend (or
              more) can code side by side, talk about what you're coding using
              the video chat, take notes that all get saved to that room. All
              the components in the classroom are modular, drag and droppable,
              so that you only need to see the things you really care about.
            </p>
            <p>Sign up now to start hacking away no installations at all!</p>

            <Button
              onClick={this.signupPush}
              className={classes.button}
              id="flashy"
            >
              Sign Up
            </Button>
          </div>

          <div className="slide open">
            <span className="image1" />
          </div>
          <div className={classes.info}>
            <h1>About Sensical</h1>
            <p>
              My application was inspired by the changing educational landscape.
              As students, we oftentimes found ourselves wanting to study
              together, but traffic, weather, and all sorts of obstacles can get
              in the way of meeting up. In these cases, we would have to use
              Skype to video chat, repl.it to write out code, Google Docs to
              take notes, and Slack to chat. These tools are great on their own
              but they become cumbersome when used together.
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
              . This project is inspired by a previous project developed by me
              and three other developers that can be found{' '}
              <a href="https://github.com/Capstone1806/fig" alt="github">
                here
              </a>
              . If you are interested in some of my other work and are looking
              to hire a fullstack or front end developer, checkout my website{' '}
              <a href="https://portfolio-6eyf.onrender.com/" alt="github">
                https://portfolio-6eyf.onrender.com/
              </a>
            </p>
            <div id="icon-attribution">
              Icons made by{' '}
              <a
                href="https://www.flaticon.com/authors/photo3idea-studio"
                title="photo3idea_studio"
              >
                photo3idea_studio
              </a>{' '}
              from{' '}
              <a href="https://www.flaticon.com/" title="Flaticon">
                www.flaticon.com
              </a>{' '}
              is licensed by{' '}
              <a
                href="http://creativecommons.org/licenses/by/3.0/"
                title="Creative Commons BY 3.0"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC 3.0 BY
              </a>
            </div>
          </div>
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
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
