import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: 'none'
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

  run() {
    const {input} = this.props
    try {
      this.setState({
        // eslint-disable-next-line
        output: eval(input)
      })
    } catch (error) {
      this.setState({
        // eslint-disable-next-line
        output: error.message
      })
    }
  }

  render() {
    const {classes} = this.props
    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.run}
        >
          Run
        </Button>
        <p id="terminal1">
          >_
          {this.state.output}
        </p>
      </div>
    )
  }
}

Output.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Output)
