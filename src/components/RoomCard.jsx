import React from 'react'
import db from '../firestore'
import firebase from 'firebase'

import {withStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import ShareIcon from '@material-ui/icons/Share'

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
  }
})

const RoomCard = props => {
  const {classes} = props
  // const joinRoom = async id => {
  //   const currentUser = await firebase.auth().currentUser
  //   let user = await db
  //     .collection('users')
  //     .doc(currentUser.uid)
  //     .get()
  //   let roomsArray = user.data().rooms
  //   if (roomsArray.indexOf(props.id) === -1) {
  //     await db
  //       .collection('users')
  //       .doc(currentUser.uid)
  //       .update({
  //         rooms: roomsArray.concat(props.id)
  //       })

  //     props.history.push(`/classroom/${id}`)
  //   }
  // }

  const leaveRoom = async id => {
    const currentUser = await firebase.auth().currentUser
    let user = await db
      .collection('users')
      .doc(currentUser.uid)
      .get()
    let roomsArray = user.data().rooms
    let indexRoomToLeave = roomsArray.indexOf(props.id)
    roomsArray.splice(indexRoomToLeave, 1)
    await db
      .collection('users')
      .doc(currentUser.uid)
      .update({
        rooms: roomsArray
      })
    props.history.push('/profile')
  }

  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image="http://cdn.shopify.com/s/files/1/1091/8014/products/whiteyboard_chalkboard_grande.jpeg?v=1528698765"
          title={props.subject}
        />
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            {props.subject}
          </Typography>
          <Typography component="p">Practice your coding here.</Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="default"
            className={classes.button}
            onClick={() => props.history.push(`/classroom/${props.id}`)}
          >
            Join
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Invite
            <ShareIcon className={classes.rightIcon} />
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={leaveRoom}
          >
            Leave
            <DeleteIcon className={classes.rightIcon} />
          </Button>
        </CardActions>
      </Card>
    </React.Fragment>
  )
}

export default withStyles(styles)(RoomCard)
