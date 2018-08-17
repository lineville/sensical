import React, {Component} from 'react'
import db from '../firestore'

import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: 0,
    marginRight: 0
  },
  icon: {
    margin: theme.spacing.unit * 2
  },
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  }
})

class RoomMembers extends Component {
  constructor() {
    super()
    this.state = {
      username: ''
    }
  }

  async componentDidMount() {
    if (this.props.id) {
      const user = await db
        .collection('users')
        .doc(this.props.id)
        .get()
      const username = user.data().username
      this.setState({username})
    }
  }

  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <Typography variant="title" color="inherit" className={classes.flex}>
          {this.state.username}
        </Typography>
      </div>
    )
  }
}

RoomMembers.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(RoomMembers)
