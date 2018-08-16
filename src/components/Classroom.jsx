import React, {Component} from 'react'
import Messaging from './Messaging'
import CodeEditor from './CodeEditor'
import Canvas from './Canvas'
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
import RoomStatusBar from './RoomStatusBar'

const moduleTarget = {
  canDrop(props, monitor) {
    let sourceSubject = monitor.getItem()
    let {subject: targetSubject} = props
    return sourceSubject
  },
  drop(props, monitor) {
    let {subject: targetSubject} = props
    let sourceSubject = monitor.getItem()
    let offset = monitor.getDifferenceFromInitialOffset()
    console.log(offset)
    return sourceSubject
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    clientOffset: monitor.getDifferenceFromInitialOffset()
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
      userIds: [],
      roomId: '',
      whiteboardId: '',
      codeEditorIds: [],
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
      codeEditorIds: [
        ...this.state.codeEditorIds,
        ...classroom.data().codeEditorIds
      ],
      chatsId: classroom.data().chatsId,
      userIds: classroom.data().userIds
    })
  }

  shouldRender = () => {
    const hasCodeEditorIds = true
    this.state.codeEditorIds.forEach(editorId => {
      if (!editorId.length) return false
    })
    return (
      hasCodeEditorIds &&
      this.state.chatsId.length &&
      this.state.whiteboardId.length &&
      firebase.auth().currentUser
    )
  }
  render() {
    const {classes, isOver, connectDropTarget} = this.props
    if (this.shouldRender()) {
      return connectDropTarget(
        <div className={classes.root}>
          <RoomStatusBar
            roomId={this.state.roomId}
            userIds={this.state.userIds}
          />
          <Grid container direction="row" align-items="flex-start">
            <Grid item>
              <Messaging
                chatsId={this.state.chatsId}
                roomId={this.state.roomId}
                style={this.props.style}
              />
            </Grid>
            <Grid item>
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.title} color="textSecondary">
                    Code Editor
                  </Typography>
                  {this.state.codeEditorIds.map(id => (
                    <CodeEditor
                      codeEditorId={id}
                      key={id}
                      roomId={this.state.roomId}
                    />
                  ))}
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
            <Grid item>
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.title} color="textSecondary">
                    Invite a Friend!
                  </Typography>
                  <InviteForm roomId={this.state.roomId} />
                </CardContent>
                <Button>Remove</Button>
              </Card>
            </Grid>
          </Grid>
          {isOver && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                height: '100%',
                width: '100%',
                zIndex: 1,
                opacity: 0.3,
                backgroundColor: '#414654'
              }}
            />
          )}
        </div>
      )

      // return connectDropTarget(
      //   <div className={classes.root}>
      //     <Grid container direction="row" align-items="flex-start">
      //       <Grid item>
      //         <Messaging
      //           chatsId={this.state.chatsId}
      //           roomId={this.state.roomId}
      //         />
      //       </Grid>
      //       <Grid item>
      //         <Card className={classes.card}>
      //           <CardContent>
      //             <Typography className={classes.title} color="textSecondary">
      //               Code Editor
      //             </Typography>
      //             {/* <CodeEditor
      //               fireCodesId={this.state.fireCodesId}
      //               roomId={this.state.roomId}
      //             /> */}
      //           </CardContent>
      //           <Button>Remove</Button>
      //         </Card>
      //       </Grid>
      //       <Grid item>
      //         <Card className={classes.card}>
      //           <CardContent>
      //             <Typography className={classes.title} color="textSecondary">
      //               Canvas
      //             </Typography>
      //             {/* <Canvas
      //               whiteboardId={this.state.whiteboardId}
      //               roomId={this.state.roomId}
      //             /> */}
      //           </CardContent>
      //           <Button>Remove</Button>
      //         </Card>
      //       </Grid>
      //       <Grid item>
      //         <Card className={classes.card}>
      //           <CardContent>
      //             <Typography className={classes.title} color="textSecondary">
      //               Invite a Friend!
      //             </Typography>
      //             <InviteForm roomId={this.state.roomId} />
      //           </CardContent>
      //           <Button>Remove</Button>
      //         </Card>
      //       </Grid>
      //     </Grid>
      //     <InviteForm roomId={this.state.roomId} />
      //     {isOver && (
      //       <div
      //         style={{
      //           position: 'absolute',
      //           top: 0,
      //           right: 0,
      //           height: '100%',
      //           width: '100%',
      //           zIndex: 1,
      //           opacity: 0.3,
      //           backgroundColor: '#414654'
      //         }}
      //       />
      //     )}
      //   </div>
      // )
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
