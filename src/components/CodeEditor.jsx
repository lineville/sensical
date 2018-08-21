import React, {Component} from 'react'
import AceEditor from 'react-ace'
import db from '../firestore'
import Output from './Output'
import 'brace/mode/javascript'
import 'brace/mode/python'
import 'brace/mode/ruby'
import 'brace/mode/sql'
import 'brace/mode/space'
import 'brace/mode/smarty'
import 'brace/mode/swift'
import 'brace/mode/coffee'
import 'brace/mode/csharp'
import 'brace/mode/css'
import 'brace/mode/elm'
import 'brace/mode/fortran'
import 'brace/mode/golang'
import 'brace/mode/haskell'
import 'brace/mode/java'
import 'brace/mode/markdown'
import 'brace/mode/php'

import 'brace/theme/monokai'
import 'brace/theme/github'
import 'brace/theme/tomorrow'
import 'brace/theme/kuroir'
import 'brace/theme/vibrant_ink'
import 'brace/theme/xcode'
import 'brace/theme/terminal'
import 'brace/theme/twilight'
import 'brace/theme/tomorrow_night_eighties'
import 'brace/theme/mono_industrial'
import 'brace/theme/eclipse'
import 'brace/theme/chrome'
import 'brace/theme/clouds_midnight'
import 'brace/theme/merbivore_soft'
import 'brace/theme/solarized_dark'
import 'brace/theme/solarized_light'

import firebase from 'firebase'

class CodeEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '',
      codeEditorId: '',
      user: {},
      canType: false
    }
    this.onChange = this.onChange.bind(this)
  }

  async componentDidMount() {
    const {codeEditorId} = this.props
    const doc = await db
      .collection('codeEditors')
      .doc(codeEditorId)
      .get()
    const user = await db
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get()
    this.setState({
      codeEditorId: doc.id,
      code: doc.data().code,
      user: user.data()
    })
    if (!this.canType()) {
      db.collection('codeEditors')
        .doc(codeEditorId)
        .onSnapshot(code => {
          this.setState({
            code: code.data().code,
            canType: this.canType()
          })
        })
    }

    db.collection('codeEditors')
      .doc(codeEditorId)
      .onSnapshot(() => {
        this.setState({
          canType: this.canType()
        })
      })
  }

  onChange(value) {
    this.setState({
      code: value
    })
    db.collection('codeEditors')
      .doc(this.state.codeEditorId)
      .update({
        code: value
      })
  }

  canType = () => {
    return this.state.user.codeEditorIds.includes(this.props.codeEditorId)
  }

  render() {
    if (!Object.keys(this.props.settings).length) {
      return <div />
    }
    return (
      <div>
        <AceEditor
          mode={this.props.settings.mode}
          theme={this.props.settings.theme}
          onChange={this.onChange}
          value={this.state.code}
          name="code-editor"
          tabSize={this.props.settings.tabSize}
          showGutter={this.props.settings.showGutter}
          fontSize={this.props.settings.fontSize}
          setOptions={{
            showLineNumbers: this.props.settings.showLineNumbers,
            tabSize: this.props.settings.tabSize
          }}
          readOnly={!this.state.canType}
          editorProps={{$blockScrolling: true}}
        />
        <Output input={this.state.code} />
      </div>
    )
  }
}

export default CodeEditor
