import React from 'react'

const Message = props => (
  <div>
    <span>{props.message.timestamp}</span>
    <span>
      {props.message.user}
      :&nbsp;
      {props.message.text}
    </span>
  </div>
)

export default Message
