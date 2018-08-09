import React, {Component} from 'react'
import db from '../firestore'
import Message from './Message'

export default class Messaging extends Component {
  constructor() {
    super()
    this.state = {
      messages: [],
      newMessage: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async componentDidMount() {
    let messages = []
    await db.collection('chats').get().then(function(querySnapshot) {
      querySnapshot.forEach(doc => {
        messages.push({id: doc.id, ...doc.data()})
      })
    })
    this.setState({messages: messages})
    console.log(this.state)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
    console.log(this.state)
  }

  async handleSubmit(event) {
    event.preventDefault()
    await db.collection('chats').doc().set({
      user: 'testing',
      text: this.state.newMessage
    })
    this.setState({
      newMessage: ''
    })
  }

  render() {
    return (
      <div id='messages'>
        {this.state.messages.map(message => (
          <Message key={message.id} message={message} />
        ))}
        <form onSubmit={this.handleSubmit}>
          <input type='text' name='newMessage' value={this.state.newMessage} onChange={this.handleChange} />
          <button type='submit'>Send</button>
        </form>
      </div>
    )
  }
}
