import React from 'react'

import Typography from '@material-ui/core/Typography'

const Message = props => (
  <Typography>
    {props.message.user}
    :&nbsp;
    {props.message.text}
  </Typography>
)

export default Message
