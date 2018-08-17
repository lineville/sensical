import React from 'react'

import Typography from '@material-ui/core/Typography'

const Message = props => (
  <Typography>
    <p>
      {props.message.user}
      :&nbsp;
      {props.message.text}
    </p>
  </Typography>
)

export default Message
