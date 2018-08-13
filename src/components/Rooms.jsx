import React, {Component} from 'react'
<<<<<<< HEAD
=======
import db from '../firestore'
import firebase from 'firebase'
import Button from '@material-ui/core/Button'

class Rooms extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rooms: []
    }
    this.joinRoom = this.joinRoom.bind(this)
  }
>>>>>>> master

import {withStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import DeleteIcon from '@material-ui/icons/Delete'
import ShareIcon from '@material-ui/icons/Share'

<<<<<<< HEAD
const styles = theme => ({
  card: {
    maxWidth: 300
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
=======
  async joinRoom(id) {
    const currentUser = await firebase.auth().currentUser
    console.log(currentUser.uid)

    await db
      .collection('users')
      .doc(currentUser.uid)
      .update({
        [id]: true
      })

    this.props.history.push(`/classroom/${id}`)
>>>>>>> master
  }
})

<<<<<<< HEAD
const Rooms = props => {
  const {classes} = props
  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image="http://cdn.shopify.com/s/files/1/1091/8014/products/whiteyboard_chalkboard_grande.jpeg?v=1528698765"
          title={props.id}
        />
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            {props.id}
          </Typography>
          <Typography component="p">Practice your coding here.</Typography>
        </CardContent>
        <CardActions>
          {/* <Button size="small" color="primary">
            Invite
          </Button> */}
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Send
            {/* <Icon className={classes.rightIcon}>send</Icon> */}
            <ShareIcon className={classes.rightIcon} />
          </Button>
          {/* <Button size="small" color="primary">
            Remove
          </Button> */}
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
          >
            Delete
            <DeleteIcon className={classes.rightIcon} />
          </Button>
        </CardActions>
      </Card>
    </React.Fragment>
  )
=======
  render() {
    return (
      <div>
        <ul>
          {this.state.rooms.map(room => {
            return (
              <div key={this.state.rooms.indexOf(room)}>
                <li>{room.id}</li>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    this.joinRoom(room.id)
                  }}
                >
                  Join Room
                </Button>
              </div>
            )
          })}
        </ul>
      </div>
    )
  }
>>>>>>> master
}

export default withStyles(styles)(Rooms)
