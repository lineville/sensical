import React, {Component} from 'react'
import db from '../firestore'
import Message from './Message'

export default class Messaging extends Component {
  constructor() {
    super()
    this.state = {
      messages: []
    }
  }

  async componentDidMount() {
    let messages = []
    await db.collection('chats').get().then(function(querySnapshot) {
      querySnapshot.forEach(doc => {
        messages.push({id: doc.id, ...doc.data()})
          // return {
          //   id: doc.id,
          //   user: doc.data().user,
          //   text: doc.data().text
          // }
      })
    })
    this.setState({messages: messages})
    console.log(this.state)
  }

  render() {
    return (
      <div id='messages'>
        {this.state.messages.map(message => (
          <Message key={message.id} message={message} />
        ))}
        <form>
          <input type='text' name='message' />
          <button type='submit'>Send</button>
        </form>
      </div>
    )
  }
}
