import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import limitEval from '../sanitize'

const styles = theme => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
})

class Output extends Component {
  constructor(props) {
    super(props)
    this.state = {
      output: ''
    }
    this.run = this.run.bind(this)
  }

  componentDidMount() {
    window.onerror = (message, source, lineno, colno, error) => {
      console.log('on error listener called')
      this.setState({
        output: message
      })
    }
  }

  // componentWillUnmount() {
  //   window.removeEventListener('error')
  // }

  run() {
    const {input} = this.props
    let oldLog = console.log
    let oldError = console.error
    this.setState({output: ''})

    limitEval(
      input,
      (success, returnValue) => {
        if (success) {
          this.setState({
            output: returnValue
          })
        } else {
          //some kind of error either timeout or anything else

          try {
            //eslint-disable-next-line
            // eval(input)
            this.setState({
              output:
                'The code takes too long to run... Is there is an infinite loop?'
            })
          } catch (error) {
            this.setState({
              output: error.message
            })
          }
        }
      },
      3000
    )
    console.log = oldLog
    console.error = oldError
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
            <Typography className={classes.heading}>Output</Typography>
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
