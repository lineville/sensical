import firebase from "firebase"
import React, {Component} from 'react'
import fire from '../fire'

class Auth extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      email: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
    console.log(this.state)
  }

  async handleSubmit(event) {
    // event.preventdefault();
    await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      });
  }

  render() {
    return (
      <div className="auth-form">
        <input type="username" name="username" placeholder="username" onChange={this.handleChange} />
        <input type="email" name="email" placeholder="email" onChange={this.handleChange} />
        <input type="password" name="password" placeholder="password" onChange={this.handleChange} />
        <button type="submit" onClick={this.handleSubmit}>submit</button>
      </div>
    )
  }
}

export default Auth
