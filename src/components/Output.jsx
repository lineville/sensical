import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
} from '@material-ui/core/'
import {ExpandMore as ExpandMoreIcon} from '@material-ui/icons/'
import limitEval from '../sanitize'
import styles from '../styles/OutputStyles'

class Output extends Component {
  constructor(props) {
    super(props)
    this.state = {
      output: '',
    }
  }

  executeJavaScript = (code) => {
    limitEval(
      code,
      (success, returnValue) => {
        try {
          if (success) {
            this.setState({
              output: returnValue,
            })
          } else if (!returnValue) {
            this.setState({
              output: 'Process took too long. Is there an infinite loop?',
            })
          } else {
            this.setState({
              output: returnValue,
            })
          }
        } catch (error) {
          this.setState({
            output: error.message,
          })
        }
      },
      3000
    )
  }

  executePython = () => {
    console.log('python exec called')
  }

  run = () => {
    const {input} = this.props
    this.setState({output: ''})
    // for JavaScript code
    switch (this.props.language) {
      case 'javascript':
        this.executeJavaScript(input)
        break
      case 'python':
        this.executePython(input)
        break
      default:
        this.executeJavaScript(input)
        break
    }
  }

  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            onClick={this.run}
            onChange={() => this.setState({output: ''})}
          >
            <Typography className={classes.heading}>Run</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>{this.state.output}</Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    )
  }
}

Output.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Output)
