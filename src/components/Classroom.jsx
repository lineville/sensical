import React, {Component} from 'react'
import CodeEditor from './CodeEditor'
import Canvas from './Canvas'
import PropTypes from 'prop-types'
import Messaging from './Messaging'
import {withRouter} from 'react-router-dom'
import db from '../firestore'
import {withStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Sidebar from './Sidebar'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary
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
      this.state.whiteboardId.length
    ) {
      return (
        <div className={classes.root}>
          <Grid container spacing={24}>
            <Sidebar />
            <Grid item xs={6} sm={6}>
              <Messaging
                chatsId={this.state.chatsId}
                roomId={this.state.roomId}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <CodeEditor
                fireCodesId={this.state.fireCodesId}
                roomId={this.state.roomId}
              />
            </Grid>
          </Grid>
          {/* <Canvas
            whiteboardId={this.state.whiteboardId}
            roomId={this.state.roomId}
          /> */}
        </div>
      )
    }
    return <div />
  }
}

Classroom.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(withRouter(Classroom))
