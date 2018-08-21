import React, {Component} from 'react'
import CodeEditor from './CodeEditor'
import PropTypes from 'prop-types'
import {DragSource} from 'react-dnd'
import db from '../firestore'
import firebase from 'firebase'

import {withStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import EditIcon from '@material-ui/icons/Edit'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Snackbar from '@material-ui/core/Snackbar'
import DialogTitle from '@material-ui/core/DialogTitle'
import DoneIcon from '@material-ui/icons/Done'
import CancelIcon from '@material-ui/icons/Cancel'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Select from '@material-ui/core/Select'
import Switch from '@material-ui/core/Switch'
import Notification from './Notification'

const codeEditorSource = {
  beginDrag(props) {
    return {...props, modName: 'codeEditors'}
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

const styles = theme => ({
  card: {
    minWidth: 275,
    position: 'absolute'
  },
  label: {
    textAlign: 'center'
  },
  button: {
    margin: theme.spacing.unit,
    marginLeft: '300px'
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 15
  }
})

class CodeEditorCard extends Component {
  constructor() {
    super()
    this.state = {
      mode: 'javascript',
      theme: 'monokai',
      fontSize: 12,
      showGutter: true,
      showLineNumbers: true,
      tabSize: 2,
      settingsFormOpen: false,
      snackBarMessage: '',
      snackBarVariant: '',
      open: false,
      username: ''
    }
  }

  async componentDidMount() {
    const id = await this.props.codeEditorId
    db.collection('codeEditors')
      .doc(id)
      .get()
      .then(editor => {
        this.setState({
          mode: editor.data().settings.mode,
          theme: editor.data().settings.theme,
          fontSize: Number(editor.data().settings.fontSize),
          showGutter: editor.data().settings.showGutter,
          showLineNumbers: editor.data().settings.showLineNumbers,
          tabSize: Number(editor.data().settings.tabSize)
        })
      })
    db.collection('codeEditors')
      .doc(id)
      .get()
      .then(editor => {
        console.log(editor.data())
        db.collection('users')
          .doc(editor.data().userId)
          .get()
          .then(user => {
            this.setState({
              username: user.data().username
            })
          })
      })
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      open: false,
      settingsFormOpen: false
    })
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleEdit = () => {
    try {
      db.collection('codeEditors')
        .doc(this.props.codeEditorId)
        .update({
          settings: {
            mode: this.state.mode,
            theme: this.state.theme,
            fontSize: Number(this.state.fontSize),
            showGutter: this.state.showGutter,
            showLineNumbers: this.state.showLineNumbers,
            tabSize: Number(this.state.tabSize)
          }
        })
        .then(() => {
          this.setState({
            settingsFormOpen: false,
            snackBarMessage: 'Settings updated!',
            snackBarVariant: 'success'
          })
        })
        .then(() => {
          this.setState({
            open: true
          })
        })
    } catch (error) {
      this.setState({
        settingsFormOpen: false,
        snackBarMessage: `Oops... unable to save settings. Error: ${
          error.message
        }`,
        snackBarVariant: 'error',
        open: true
      })
    }
  }

  render() {
    const {classes, connectDragSource, isDragging, position} = this.props
    if (!position) {
      return <div />
    }
    return connectDragSource(
      <div className="item">
        <Card
          className={classes.card}
          style={{
            opacity: isDragging ? 0.3 : 1,
            cursor: 'move',
            resize: 'both',
            top: position.top,
            left: position.left
          }}
        >
          <CardContent>
            <Typography className={classes.title} color="textSecondary">
              {this.state.username}
              's Code Editor
              <Button
                variant="fab"
                mini
                color="primary"
                className={classes.button}
                onClick={() => this.setState({settingsFormOpen: true})}
              >
                <EditIcon />
              </Button>
            </Typography>
            <div>
              <CodeEditor
                codeEditorId={this.props.codeEditorId}
                roomId={this.props.roomId}
                settings={this.state}
              />
              <Dialog
                open={this.state.settingsFormOpen}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">
                  Code Editor Settings
                </DialogTitle>

                <DialogContent>
                  <form className={classes.container}>
                    <FormControl className={classes.formControl}>
                      <Select
                        native
                        value={this.state.theme}
                        onChange={this.handleChange}
                        input={<Input id="native-simple" />}
                        name="theme"
                      >
                        <option value="monokai">Monokai</option>
                        <option value="github">GitHub</option>
                        <option value="tomorrow">Tomorrow</option>
                        <option value="kuroir">Kuroir</option>
                        <option value="twilight">Twilight</option>
                        <option value="xcode">Xcode</option>
                        <option value="textmate">TextMate</option>
                        <option value="solarized_dark">Solarized Dark</option>
                        <option value="solarized_light">Solarized Light</option>
                        <option value="terminal">Terminal</option>
                        <option value="twilight">Twilight</option>
                        <option value="tomorrow_night_eighties">
                          Tomorrow Night Eighties
                        </option>
                        <option value="mono_industrial">Mono Industrial</option>
                        <option value="eclipse">Eclipse</option>
                        <option value="chrome">Chrome</option>
                        <option value="clouds_midnight">Clouds Midnight</option>
                        <option value="merbivore_soft">Merbivore Soft</option>
                      </Select>
                      <FormHelperText className={classes.label}>
                        Theme
                      </FormHelperText>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                      <Select
                        native
                        value={this.state.mode}
                        name="mode"
                        onChange={this.handleChange}
                        input={<Input id="native-simple" />}
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="ruby">Ruby</option>
                        <option value="sql">SQL</option>
                        <option value="space">Space</option>
                        <option value="smarty">Smarty</option>
                        <option value="swift">Swift</option>
                        <option value="coffee">Coffee</option>
                        <option value="csharp">C#</option>
                        <option value="css">CSS</option>
                        <option value="elm">Elm</option>
                        <option value="golang">Go</option>
                        <option value="java">Java</option>
                        <option value="markdown">Markdown</option>
                        <option value="php">PHP</option>
                      </Select>
                      <FormHelperText className={classes.label}>
                        Language
                      </FormHelperText>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                      <Select
                        native
                        value={this.state.fontSize}
                        name="fontSize"
                        onChange={this.handleChange}
                        input={<Input id="native-simple" />}
                      >
                        <option value={12}>12</option>
                        <option value={14}>14</option>
                        <option value={16}>16</option>
                        <option value={18}>18</option>
                        <option value={20}>20</option>
                        <option value={24}>24</option>
                        <option value={28}>28</option>
                        <option value={40}>40</option>
                      </Select>
                      <FormHelperText className={classes.label}>
                        Font Size
                      </FormHelperText>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                      <Select
                        native
                        value={this.state.tabSize}
                        name="tabSize"
                        onChange={this.handleChange}
                        input={<Input id="native-simple" />}
                      >
                        <option value={0}>0</option>
                        <option value={2}>2</option>
                        <option value={4}>4</option>
                        <option value={6}>6</option>
                      </Select>
                      <FormHelperText className={classes.label}>
                        Tab Size
                      </FormHelperText>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                      <Switch
                        checked={this.state.showGutter}
                        onChange={() =>
                          this.setState({showGutter: !this.state.showGutter})
                        }
                        value={'' + this.state.showGutter}
                        color="primary"
                      />
                      Gutter
                    </FormControl>
                    <FormControl className={classes.formControl}>
                      <Switch
                        checked={this.state.showLineNumbers}
                        onChange={() =>
                          this.setState({
                            showLineNumbers: !this.state.showLineNumbers
                          })
                        }
                        value={'' + this.state.showLineNumbers}
                        color="primary"
                      />
                      Line Numbers
                    </FormControl>
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleClose} color="secondary">
                    <CancelIcon />
                  </Button>
                  <Button onClick={this.handleEdit} color="primary">
                    <DoneIcon />
                  </Button>
                </DialogActions>
              </Dialog>
              <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                open={this.state.open}
                autoHideDuration={6000}
                onClose={this.handleClose}
              >
                <Notification
                  onClose={this.handleClose}
                  variant={this.state.snackBarVariant}
                  message={this.state.snackBarMessage}
                />
              </Snackbar>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

CodeEditorCard.propTypes = {
  classes: PropTypes.object.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
}

export default DragSource('MODULE', codeEditorSource, collect)(
  withStyles(styles)(CodeEditorCard)
)
