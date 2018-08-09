import React, {Component} from 'react';
import Messaging from './Messaging';
import CodeEditor from './CodeEditor';

export default class Classroom extends Component {
  render () {
    return (
      <div className='columns'>
        <Messaging />
        <CodeEditor />
      </div>
    )
  }
}
