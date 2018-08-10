import React from 'react'

const Message = props => (
  <div>
    <span>{props.message.user}</span>
    :&nbsp;
    <span>{props.message.text}</span>
  </div>
)

export default Message
