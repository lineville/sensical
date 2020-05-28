import React, {Component} from 'react'
import db from '../firestore'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import {Typography} from '@material-ui/core/'
import styles from '../styles/RoomMembersStyles'

class RoomMembers extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
    }
  }

  async componentDidMount() {
    if (this.props.id) {
      const user = await db.collection('users').doc(this.props.id).get()
      const username = user.data().username
      this.setState({username})
    }
  }

  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <Typography variant="h3" color="inherit" className={classes.text}>
          {this.state.username}
        </Typography>
      </div>
    )
  }
}

RoomMembers.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(RoomMembers)
