import React from 'react';

const Message = (props) => (
  <div>
    <span>{props.message.user}</span>
    <span>{props.message.text}</span>
  </div>
)

export default Message
