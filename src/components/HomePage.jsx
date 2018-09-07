import React, {Component} from 'react'
import {Snackbar, Typography, Button} from '@material-ui/core/'
import {Notification} from '../imports'
import $ from 'jquery'

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
    console.log(this.state.popupOpen)
    return (
      <div style={{marginTop: '50px'}}>
        <div className="slidelist">
          <div className="info-card">
           <Typography
                className="brand-name"
                variant="title"
                color="inherit"
              >
                fig - Let Knowledge Grow
              </Typography>
            <p>
              <i>Your classroom should be a reflection of your personal learning style. So we made classrooms customizable.</i>
              <br />
              <br />
              Sign up now to get started using a fig room.
              <br />
            </p>
            <Button onClick={this.signupPush} style={{backgroundColor: "white"}}>
              Sign Up
            </Button>
            <p></p>
          </div>

          <div className="slide open" style={{left: '-100%'}}>
            <span className="image1" />
          </div>
          <div className="slide open" style={{left: '-100%'}}>
            <span className="image2" />
          </div>
          <div className="slide open" style={{left: '-100%'}}>
            <span className="image3" />
          </div>
          <div className="slide open" style={{left: '-100%'}}>
            <span className="image4" />
          </div>
          <div className="slide open" style={{left: '0%'}}>
            <span className="image5" />
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
        
          <div className="info">
            <h1>A little about fig.</h1>
            <p> 
              Our application was inspired by the changing educational landscape.  As students, we oftentimes found ourselves wanting to study together, but traffic, weather, and the L train get in the way of meeting up.
              In these cases, we would have to use Skype to video chat, repl.it to write out code, Google Docs to take notes. These tools are great on their own but they become cumbersome when used together. 
            </p>
            <p>
              This is why we created fig. 
              Fig rooms provide students with a modularized real-time collaborative learning environment. 
              Fig allows students to build a virtual ‘classroom’ where they can use built-in learning modules to work and study together on a variety of subjects.
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
            variant="warning"
            message="Sorry you must be logged in or be invited to the page you are trying to access"
          />
        </Snackbar>
      </div>
    )
  }
}

//jQuery caroussel
$(document).ready(function() {
  window.setInterval(function() {
    var next = ($('.select').index() + 1) % $('.circle').length
    var prev = $('.select').index()
    $('.select').removeClass('select')
    $('.circle')
      .eq(next)
      .addClass('select')
    $('.slide')
      .eq(next)
      .addClass('open')
      .css('left', '100%')
    $('.slide')
      .eq(prev)
      .animate({left: '-100%'}, 700)
    $('.slide')
      .eq(next)
      .animate({left: '0%'}, 700)
  }, 7000)
})

export default HomePage
