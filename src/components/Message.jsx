import React, {Component} from 'react'

import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  message: {
    padding: 7
  },
  sender: {
    fontSize: 10
  },
  textBubble: {
    margin: 5,
    padding: 5,
    color: theme.palette.primary.main,
    borderRadius: 5
  }
})

export class Message extends Component {
  render() {
    const {classes} = this.props
    return (
      <div className={classes.message}>
        <Typography>
          <span className={classes.sender}>{this.props.message.user}</span>
          <span className={classes.textBubble}>{this.props.message.text}</span>
        </Typography>
      </div>
    )
  }
}
export default withStyles(styles)(Message)
