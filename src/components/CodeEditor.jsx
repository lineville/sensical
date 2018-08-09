import React, {Component} from 'react'
import {split as SplitEditor} from 'react-ace'
import db from '../firestore'
import Output from './Output'

import 'brace/mode/javascript'
import 'brace/theme/monokai'

class CodeEditor extends Component {
  constructor() {
    super()
    this.state = {
      code1: '',
      code2: '',
      roomId: ''
    }
    this.onChange = this.onChange.bind(this)
  }

  async componentDidMount() {
    const room = await db.collection('fireCodes').add({
      code1: this.state.code1,
      code2: this.state.code2
    })
    this.setState({roomId: room.id})
  }

  onChange(value) {
    this.setState({
      code1: value[0],
      code2: value[1]
    })
    db.collection('fireCodes')
      .doc(this.state.roomId)
      .set({
        code1: this.state.code1,
        code2: this.state.code2
      })
  }

  render() {
    return (
      <div className="editor-terminal">
        <div className="code-editor">
          <SplitEditor
            mode="javascript"
            theme="monokai"
            splits={2}
            orientation="beside"
            onChange={this.onChange}
            value={[this.state.code1, this.state.code2]}
            name="code-editor"
            editorProps={{$blockScrolling: true}}
          />
        </div>
        <div className="terminal">
          <Output input1={this.state.code1} input2={this.state.code2} />
        </div>
      </div>
    )
  }
}

export default CodeEditor
