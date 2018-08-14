import React, {Component} from 'react'
import CodeEditor from './CodeEditor'
import Canvas from './Canvas'
import Messaging from './Messaging'
import NavMenu from './NavMenu'
import db from '../firestore'
import firebase from 'firebase'

import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  card: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
})

class Classroom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomId: '',
      whiteboardId: '',
      fireCodesId: '',
      chatsId: ''
    }
  }

  async componentDidMount() {
    const classroom = await db
      .collection('rooms')
      .doc(this.props.match.params.classroomId)
      .get()
    this.setState({
      roomId: classroom.id,
      whiteboardId: classroom.data().whiteboardId,
      fireCodesId: classroom.data().fireCodesId,
      chatsId: classroom.data().chatsId
    })
  }

  render() {
    const {classes} = this.props
    if (
      this.state.fireCodesId.length &&
      this.state.chatsId.length &&
      this.state.whiteboardId.length &&
      firebase.auth().currentUser
    ) {
      return (
        <div className={classes.root}>
          <NavMenu />
          <Grid container direction="row" align-items="flex-start">
            <Grid item>
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.title} color="textSecondary">
                    Chat
                  </Typography>
                  <Messaging
                    chatsId={this.state.chatsId}
                    roomId={this.state.roomId}
                  />
                </CardContent>
                <Button>Remove</Button>
              </Card>
            </Grid>
            <Grid item>
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.title} color="textSecondary">
                    Code Editor
                  </Typography>
                  <CodeEditor
                    fireCodesId={this.state.fireCodesId}
                    roomId={this.state.roomId}
                  />
                </CardContent>
                <Button>Remove</Button>
              </Card>
            </Grid>
            <Grid item>
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.title} color="textSecondary">
                    Canvas
                  </Typography>
                  <Canvas
                    whiteboardId={this.state.whiteboardId}
                    roomId={this.state.roomId}
                  />
                </CardContent>
                <Button>Remove</Button>
              </Card>
            </Grid>
          </Grid>
        </div>
      )
    }
    return <div />
  }
}

Classroom.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Classroom)
