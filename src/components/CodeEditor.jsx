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
      code: ''
    }
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {}

  onChange(value) {
    this.setState({
      code: value
    })
    db.collection('fireCodes').add({code: this.state.code})
  }

  render() {
    return (
      <div className="editor-terminal">
        <div className="code-editor">
          <AceEditor
            mode="javascript"
            theme="monokai"
            onChange={this.onChange}
            name="code-editor"
            editorProps={{$blockScrolling: true}}
            value={this.state.code}
          />
        </div>
        <button className="button is-primary is-inverted">Inverted</button>
        <div className="terminal">
          <Output input={this.state.code} />
        </div>
      </div>
    )
  }
}

export default CodeEditor
