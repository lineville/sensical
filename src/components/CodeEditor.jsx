import React, {Component} from 'react'
import AceEditor from 'react-ace'
import firebase from 'firebase'
import db from '../firestore'
import {Output} from '../imports'
import '../imports/aceModes'
import '../imports/aceThemes'

class CodeEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '',
      codeEditorId: '',
      user: {},
      canType: false
    }
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

  onChange = value => {
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
