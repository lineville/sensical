import React, {Component} from 'react'
import {withStyles} from '@material-ui/core/styles'
import {Typography} from '@material-ui/core/'
import styles from '../styles/MessageStyles'

export class Message extends Component {
  render() {
    const {classes} = this.props
    return (
      <div className={classes.message}>
        <Typography>
          <span className={classes.sender}>{this.props.message.user}</span>
          <span className={classes.bubble}>{this.props.message.text}</span>
        </Typography>
      </div>
    )
  }
}
export default withStyles(styles)(Message)
