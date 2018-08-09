import React, {Component} from 'react';
import Canvas from './whiteboard/Canvas';

export default class Classroom extends Component {
  render () {
    return (
      <div id="classroom">
        <Canvas />
      </div>
    )
  }
}
