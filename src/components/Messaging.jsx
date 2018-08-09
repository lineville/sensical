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
    await db
      .collection('chats')
      .doc('8SEsFPVQTgJIv6pPTkbk')
      .collection('messages')
      .onSnapshot(querySnapshot => {
        let messages = []
        querySnapshot.forEach(doc => {
          messages.push({id: doc.id, ...doc.data()})
        })
        this.setState({messages: messages})
      })
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
    console.log(this.state)
  }

  async handleSubmit(event) {
    event.preventDefault()
    await db
      .collection('chats')
      .doc('8SEsFPVQTgJIv6pPTkbk')
      .collection('messages')
      .add({
        user: 'testing',
        text: this.state.newMessage
      })
    this.setState({
      newMessage: ''
    })
  }

  render() {
    return (
      <div id="messages" className="column modal-card is=flex">
        <p className="modal-card-title">Class Chat</p>
        <div className="modal-card-body">
          {this.state.messages.map(message => (
            <Message key={message.id} message={message} />
          ))}
        </div>
        <form onSubmit={this.handleSubmit} className="columns modal-card-foot">
          <input
            className="input"
            type="text"
            name="newMessage"
            value={this.state.newMessage}
            onChange={this.handleChange}
          />
          <button className="button is-outlined is-primary" type="submit">
            Send
          </button>
        </form>
      </div>
    )
  }
}
