import React, {Component} from 'react'
import db from '../firestore'
import Message from './Message'
import firebase from 'firebase'
import {DragSource} from 'react-dnd'

import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

const messagingSource = {
  beginDrag(props) {
    return {}
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

const styles = theme => ({
  card: {
    minWidth: 275
  },
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
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
      <div>
        <Card
          className={classes.card}
          style={{
            opacity: isDragging ? 0.5 : 1,
            cursor: 'move'
          }}
        >
          <CardContent>
            <Typography className={classes.title} color="textSecondary">
              Chat
            </Typography>
            <div id="messages">
              <div>
                {this.state.messages.map(message => (
                  <Message key={message.id} message={message} />
                ))}
              </div>
              <form
                onSubmit={this.handleSubmit}
                className="columns modal-card-foot"
              >
                <input
                  type="text"
                  name="newMessage"
                  value={this.state.newMessage}
                  onChange={this.handleChange}
                />

                <Button
                  type="submit"
                  size="small"
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                >
                  Send
                </Button>
              </form>
            </div>
          </CardContent>
          <Button>Remove</Button>
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
