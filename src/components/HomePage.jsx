import React, {Component} from 'react'
const $ = window.$

export default class HomePage extends Component {
  constructor() {
    super()
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
    return (
      <div>
        <button className="float-right" onClick={this.signupPush}>
          Signup
        </button>
        <button className="float-right" onClick={this.loginPush}>
          Login
        </button>

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
