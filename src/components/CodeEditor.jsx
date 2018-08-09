import React, {Component} from 'react'
import AceEditor from 'react-ace'
import db from '../firestore'

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
      <div id="code-editor" className="column">
        <AceEditor
          mode="javascript"
          theme="monokai"
          onChange={this.onChange}
          name="code-editor"
          editorProps={{$blockScrolling: true}}
          value={this.state.code}
        />
      </div>
    )
  }
}

export default CodeEditor
