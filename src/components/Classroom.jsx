import React, {Component} from 'react'
import CodeEditor from './CodeEditor'
import Canvas from './Canvas'
import ModuleCard from './ModuleCard'
import db from '../firestore'
import firebase from 'firebase'

import {DropTarget} from 'react-dnd'

import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import InviteForm from './InviteForm'

const moduleTarget = {
  drop(props) {}
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

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
      .doc(this.props.classroom)
      .get()
    this.setState({
      roomId: classroom.id,
      whiteboardId: classroom.data().whiteboardId,
      fireCodesId: classroom.data().fireCodesId,
      chatsId: classroom.data().chatsId
    })
  }

  render() {
    const {classes, connectDropTarget, isOver} = this.props
    if (
      this.state.fireCodesId.length &&
      this.state.chatsId.length &&
      this.state.whiteboardId.length &&
      firebase.auth().currentUser
    ) {
      return connectDropTarget(
        <div className={classes.root}>
          <Grid container direction="row" align-items="flex-start">
            <Grid item>
              <ModuleCard
                chatsId={this.state.chatsId}
                roomId={this.state.roomId}
              >
                <Button>Remove</Button>
              </ModuleCard>
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
          <InviteForm roomId={this.state.roomId} />
          {isOver && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                zIndex: 1,
                opacity: 0.5,
                backgroundColor: 'yellow'
              }}
            />
          )}
        </div>
      )
    }
    return <div />
  }
}

Classroom.propTypes = {
  classes: PropTypes.object.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired
}

export default DropTarget('MODULE', moduleTarget, collect)(
  withStyles(styles)(Classroom)
)
