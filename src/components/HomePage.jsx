import React from 'react'
import $ from 'jquery'

const HomePage = () => {
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
    </div>
  )
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
