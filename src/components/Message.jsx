import React, {Component} from 'react'
import {withStyles} from '@material-ui/core/styles'
import {Typography, Avatar} from '@material-ui/core/'
import styles from '../styles/MessageStyles'

export class Message extends Component {
  render() {
    const {classes} = this.props
    return (
      <div className={classes.bubble}>
        <Typography>
          <span className={classes.sender}>
            <Avatar
              alt={this.props.message.user.username}
              src={this.props.message.user.profilePicURL}
              className={classes.avatar}
            />
          </span>
          <span className={classes.sender}>
            {this.props.message.user.username}
          </span>
          <span className={classes.bubble}>{this.props.message.text}</span>
        </Typography>
      </div>
    )
  }
}
export default withStyles(styles)(Message)
