import React, {Component} from 'react'
import db from '../firestore'
import Message from './Message'
import firebase from 'firebase'
import {DragSource} from 'react-dnd'
import PropTypes from 'prop-types'
import {
  Send as SendIcon,
  RemoveCircleOutline as DeleteIcon
} from '@material-ui/icons/'
import {withStyles} from '@material-ui/core/styles'
import styles from '../styles/MessagingStyles'
import {
  Button,
  Card,
  CardContent,
  Typography,
  TextField
} from '@material-ui/core/'

const messagingSource = {
  beginDrag(props) {
    return {...props, modName: 'messaging'}
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

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
    if (this.state.newMessage.length) {
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
            resize: 'both',
            top: this.props.position.top,
            left: this.props.position.left,
            zIndex: this.props.position.zIndex
          }}
        >
          <CardContent>
            <Typography color="textSecondary" className={classes.title}>
              Chat
              <DeleteIcon onClick={() => this.props.handleDrop('chat')} />
            </Typography>
            <div className={classes.content}>
              <div className={classes.messages}>
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
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  onClick={this.handleSubmit}
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
