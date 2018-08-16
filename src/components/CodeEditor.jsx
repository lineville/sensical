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
      user: '',
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
    await this.setState({
      codeEditorId: doc.id,
      code: doc.data().code,
      user: user.data()
    })
    db.collection('codeEditors')
      .doc(codeEditorId)
      .onSnapshot(code => {
        this.setState({
          code: code.data().code,
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
      .set({
        code: value
      })
  }

  canType = () => {
    console.log(this.props.codeEditorId, this.state.user.codeEditorId)
    return this.props.codeEditorId === this.state.user.codeEditorId
  }

  render() {
    return (
      <div>
        <div className="">
          <AceEditor
            mode="javascript"
            theme="monokai"
            onChange={this.onChange}
            value={this.state.code}
            name="code-editor"
            tabSize={2}
            readOnly={!this.state.canType}
            editorProps={{$blockScrolling: true}}
          />
          <Output input={this.state.code} />
        </div>
      </div>
    )
  }
}

export default CodeEditor
