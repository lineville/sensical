import React, {Component} from 'react'
import db from '../firestore'
import firebase from 'firebase'

import classNames from 'classnames'
import Avatar from '@material-ui/core/Avatar'
import {withStyles} from '../../node_modules/@material-ui/core'
import Button from '@material-ui/core/Button'
import parallaxStyle from '../styles/parallaxStyle'
import RoomContainer from './RoomContainer'

const styles = theme => ({
  row: {
    display: 'flex',
    justifyContent: 'center'
  },
  avatar: {
    margin: 50
  },
  bigAvatar: {
    width: 260,
    height: 260
  },
  card: {
    maxWidth: 345
  },
  margin: {
    margin: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  ...parallaxStyle
})

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {}
    }
  }

  async componentDidMount() {
    const authorizedUser = await firebase.auth().currentUser
    await db
      .collection('users')
      .doc(authorizedUser.uid)
      .onSnapshot(doc => {
        this.setState({user: {...doc.data(), id: authorizedUser.uid}})
      })
  }

  render() {
    const {classes, filter, className, style, small} = this.props
    const parallaxClasses = classNames({
      [classes.parallax]: true,
      [classes.filter]: filter,
      [classes.small]: small,
      [className]: className !== undefined
    })
    return (
      <React.Fragment>
        <div
          className={parallaxClasses}
          style={{
            ...style
            // backgroundImage: 'url(' + image + ')'
          }}
        >
          <Avatar
            alt="Pinto Bean"
            src="http://blogs.staffs.ac.uk/student-blogs/files/2016/08/iStock_28423686_MEDIUM.jpg"
            className={classNames(classes.avatar, classes.bigAvatar)}
          />
          <p>Welcome {this.state.user.username}!</p>
          <p>Email: {this.state.user.email}</p>
          <Button size="small" color="primary">
            Change Password
          </Button>
        </div>
        <RoomContainer rooms={this.state.user.rooms} user={this.state.user} />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Profile)
