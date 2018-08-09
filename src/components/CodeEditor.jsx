import React, {Component} from 'react'
import AceEditor from 'react-ace'

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
    console.log(this.state.code)
  }

  render() {
    return (
      <div id="code-editor">
        <AceEditor
          mode="javascript"
          theme="monokai"
          onChange={this.onChange}
          name="code-editor"
          editorProps={{$blockScrolling: true}}
          value={this.state.code}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2
          }}
        />
      </div>
    )
  }
}

export default CodeEditor
