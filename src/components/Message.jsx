import React from 'react'

import {withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  // font: {
  //   font: theme.typography.fontFamily
  // }
})

const Message = props => (
  <div>
    <p>
      {props.message.user}
      :&nbsp;
      {props.message.text}
    </p>
  </div>
)

export default withStyles(styles)(Message)
