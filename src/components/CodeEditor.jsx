import React, {Component} from 'react'
import AceEditor from 'react-ace'
import db from '../firestore'
import Output from './Output'
import 'brace/mode/javascript'
import 'brace/theme/monokai'
import firebase from 'firebase'

class CodeEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '',
      codeEditorId: '',
      user: {},
      canType: false,
      settings: {}
    }
    this.onChange = this.onChange.bind(this)
  }

  async componentDidMount() {
    const {codeEditorId, settings} = this.props
    const doc = await db
      .collection('codeEditors')
      .doc(codeEditorId)
      .get()
    const user = await db
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get()
    await this.setState({
      codeEditorId: doc.id,
      code: doc.data().code,
      user: user.data(),
      settings: settings
    })
    db.collection('codeEditors')
      .doc(codeEditorId)
      .onSnapshot(code => {
        this.setState({
          code: code.data().code,
          canType: this.canType()
        })
      })
    console.log(this.state.user)
  }

  onChange(value) {
    this.setState({
      code: value
    })
    db.collection('codeEditors')
      .doc(this.state.codeEditorId)
      .set({
        code: value
      })
  }

  canType = () => {
    console.log(
      'editor id',
      this.props.codeEditorId,
      'user on state',
      this.state.user
    )
    return this.state.user.codeEditorIds.includes(this.props.codeEditorId)
  }

  render() {
    console.log(this.state.settings)
    return (
      <div>
        <AceEditor
          mode={this.state.settings.mode}
          theme={this.state.settings.theme}
          onChange={this.onChange}
          value={this.state.code}
          name="code-editor"
          tabSize={2}
          readOnly={!this.state.canType}
          editorProps={{$blockScrolling: true}}
        />
        <Output input={this.state.code} />
      </div>
    )
  }
}

export default CodeEditor
