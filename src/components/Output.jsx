import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography
} from '@material-ui/core/'
import {ExpandMore as ExpandMoreIcon} from '@material-ui/icons/'
import limitEval from '../sanitize'
import styles from '../styles/OutputStyles'

class Output extends Component {
  constructor(props) {
    super(props)
    this.state = {
      output: ''
    }
    // this.run = this.run.bind(this)
  }

  componentDidMount() {
    window.onerror = (message, source, lineno, colno, error) => {
      this.setState({
        output: message
      })
    }
  }

  run = () => {
    const {input} = this.props
    this.setState({output: ''})

    limitEval(
      input,
      (success, returnValue) => {
        try {
          if (success) {
            this.setState({
              output: returnValue
            })
          } else if (!returnValue) {
            this.setState({
              output: 'Process took too long. Is there an infinite loop?'
            })
          } else {
            this.setState({
              output: returnValue
            })
          }
        } catch (error) {
          this.setState({
            output: error.message
          })
        }
      },
      3000
    )
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
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Output)
