import React, {Component} from 'react'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import {Link} from 'react-router-dom'
const $ = window.$

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: 'none'
  }
})

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.loginPush = this.loginPush.bind(this)
    this.signupPush = this.signupPush.bind(this)
  }

  loginPush() {
    this.props.history.push('/login')
  }

  signupPush() {
    this.props.history.push('/signup')
  }

  render() {
    const {classes} = this.props
    return (
      <div>
        <Link to="/signup">
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
          >
            SignUp
          </Button>
        </Link>
        <Link to="/login">
          <Button
            variant="contained"
            color="default"
            className={classes.button}
          >
            Login
          </Button>
        </Link>
        <script type="text/javascript">
          $(document).ready(function()
          {window.setInterval(function() {
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
          }, 7000)}
          )
        </script>
        <div className="brand-name">Fig - "Let Knowledge Grow."</div>
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
      </div>
    )
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(HomePage)
