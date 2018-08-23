import React, {Component} from 'react'
import {Snackbar} from '@material-ui/core/'
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

  render() {
    console.log(this.state.popupOpen)
    return (
      <div style={{marginTop: 64}}>
        <div className="brand-name">Fig - Let Knowledge Grow.</div>
        <div className="slidelist">
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
