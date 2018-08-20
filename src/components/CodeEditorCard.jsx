import React, {Component} from 'react'
import CodeEditor from './CodeEditor'
import 'brace/mode/javascript'
import 'brace/theme/monokai'
import PropTypes from 'prop-types'
import {DragSource} from 'react-dnd'

import {withStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import EditIcon from '@material-ui/icons/Edit'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DoneIcon from '@material-ui/icons/Done'
import CancelIcon from '@material-ui/icons/Cancel'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

const codeEditorSource = {
  beginDrag(props) {
    return props
  },
  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return
    }
    return props.handleDrop()
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
    minWidth: 275
  },
  button: {
    margin: theme.spacing.unit,
    textAlign: 'float-right'
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
})

class CodeEditorCard extends Component {
  constructor() {
    super()
    this.state = {
      mode: 'javascript',
      theme: 'monokai',
      fontSize: '12',
      showGutter: true,
      showLineNumber: true,
      tabSize: 2,
      settingsFormOpen: false,
      snackBarMessage: ''
    }
  }
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      open: false,
      settingsFormOpen: false,
      snackBarMessage: ''
    })
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  render() {
    const {classes, connectDragSource, isDragging} = this.props
    return connectDragSource(
      <div className="item">
        <Card
          className={classes.card}
          style={{
            opacity: isDragging ? 0.3 : 1,
            cursor: 'move',
            resize: 'both'
          }}
        >
          <CardContent>
            <Typography className={classes.title} color="textSecondary">
              Code Editor
            </Typography>
            <div>
              {this.props.codeEditors.map(id => (
                <div key={id}>
                  <Button
                    variant="fab"
                    mini
                    color="primary"
                    className={classes.button}
                    onClick={() => this.setState({settingsFormOpen: true})}
                  >
                    <EditIcon />
                  </Button>
                  <CodeEditor
                    codeEditorId={id}
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
                            <option value="solarized_dark">
                              Solarized Dark
                            </option>
                            <option value="solarized_light">
                              Solarized Light
                            </option>
                            <option value="terminal">Terminal</option>
                          </Select>
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
                          </Select>
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
                </div>
              ))}
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
