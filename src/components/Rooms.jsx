import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import db from '../firestore'
import firebase from 'firebase'

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

const Rooms = props => {
  const {classes} = props
  const joinRoom = async id => {
    const currentUser = await firebase.auth().currentUser
    console.log('USER ID: ', currentUser.uid)

    await db
      .collection('users')
      .doc(currentUser.uid)
      .update({
        [id]: true
      })

    props.history.push(`/classroom/${id}`)
  }
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
            {/* <Link to={`/classroom/${props.id}`}>{props.id}</Link> */}
            {props.id}
          </Typography>
          <Typography component="p">Practice your coding here.</Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={() => {
              joinRoom(props.id)
            }}
          >
            Join
            <DeleteIcon className={classes.rightIcon} />
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Send
            {/* <Icon className={classes.rightIcon}>send</Icon> */}
            <ShareIcon className={classes.rightIcon} />
          </Button>
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
}

export default withStyles(styles)(Rooms)
