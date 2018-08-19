import React, {Component} from 'react'
import db from '../firestore'
import Message from './Message'
import firebase from 'firebase'
import {DragSource} from 'react-dnd'

import PropTypes from 'prop-types'
import SendIcon from '@material-ui/icons/Send'
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'

const messagingSource = {
  beginDrag(props) {
    return props
  },
  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return
    }
    return props.handleDrop()
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
    // currentOffset: monitor.getSourceClientOffset()
  }
}

const styles = theme => ({
  card: {
    maxWidth: 275
  },
  button: {
    margin: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  form: {
    display: 'flex'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
})

export class Messaging extends Component {
  constructor() {
    super()
    this.state = {
      messages: [],
      newMessage: '',
      user: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async componentDidMount() {
    await db
      .collection('chats')
      .doc(this.props.chatsId)
      .collection('messages')
      .orderBy('timestamp')
      .onSnapshot(querySnapshot => {
        let messages = []
        querySnapshot.forEach(doc => {
          messages.push({id: doc.id, ...doc.data()})
        })
        this.setState({messages: messages})
      })
    const authUser = await firebase.auth().currentUser
    const user = await db
      .collection('users')
      .doc(authUser.uid)
      .get()
    this.setState({user: user.data().username})
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  async handleSubmit(event) {
    event.preventDefault()
    await db
      .collection('chats')
      .doc(this.props.chatsId)
      .collection('messages')
      .add({
        user: this.state.user,
        text: this.state.newMessage,
        timestamp: new Date().toUTCString()
      })
    this.setState({
      newMessage: ''
    })
  }

  render() {
    const {classes, connectDragSource, isDragging} = this.props
    return connectDragSource(
      <div className="item">
        <Card
          className={classes.card}
          style={{
            opacity: isDragging ? 0.3 : 1,
            cursor: 'move',
            resize: 'both'
          }}
        >
          <CardContent>
            <Typography color="textSecondary">Chat</Typography>
            <div id="messages">
              <div>
                {this.state.messages.map(message => (
                  <Message key={message.id} message={message} />
                ))}
              </div>
              <form onSubmit={this.handleSubmit} className={classes.form}>
                <TextField
                  type="text"
                  name="newMessage"
                  value={this.state.newMessage}
                  onChange={this.handleChange}
                />

                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  Send
                  <SendIcon className={classes.rightIcon}>send</SendIcon>
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

Messaging.propTypes = {
  classes: PropTypes.object.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
}

export default DragSource('MODULE', messagingSource, collect)(
  withStyles(styles)(Messaging)
)
