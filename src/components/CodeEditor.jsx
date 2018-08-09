import React, {Component} from 'react'
import AceEditor from 'react-ace'
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
    this.onChange1 = this.onChange1.bind(this)
    this.onChange2 = this.onChange2.bind(this)
  }

  async componentDidMount() {
    const room = await db.collection('fireCodes').add({
      code1: this.state.code1,
      code2: this.state.code2
    })
    this.setState({roomId: room.id})
  }

  onChange1(value) {
    this.setState({
      code1: value
    })
    db.collection('fireCodes')
      .doc(this.state.roomId)
      .set({
        code1: this.state.code1
      })
  }
  onChange2(value) {
    this.setState({
      code2: value
    })
    db.collection('fireCodes')
      .doc(this.state.roomId)
      .set({
        code2: this.state.code2
      })
  }

  render() {
    return (
      <div className="columns">
        <div className="column">
          <AceEditor
            mode="javascript"
            theme="monokai"
            onChange={this.onChange1}
            value={this.state.code1}
            name="code-editor"
            editorProps={{$blockScrolling: true}}
          />
          <Output input={this.state.code1} />
        </div>
        <div className="column">
          <AceEditor
            mode="javascript"
            theme="monokai"
            onChange={this.onChange2}
            value={this.state.code2}
            name="code-editor"
            editorProps={{$blockScrolling: true}}
          />
          <Output input={this.state.code2} />
        </div>
      </div>
    )
  }
}

export default CodeEditor
