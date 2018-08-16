// import React, {Component} from 'react'
// import PropTypes from 'prop-types'
// import {withStyles} from '@material-ui/core/styles'
// import Button from '@material-ui/core/Button'

// const styles = theme => ({
//   button: {
//     margin: theme.spacing.unit
//   },
//   input: {
//     display: 'none'
//   }
// })

// class Output extends Component {

//   render() {
//     const {classes} = this.props
//     return (
//       <div>
//         <Button
//           variant="contained"
//           color="primary"
//           className={classes.button}
//           onClick={this.run}
//         >
//           Run
//         </Button>
//         <p className="output">
//           Output: --->
//           {this.state.output}
//         </p>
//       </div>
//     )
//   }
// }

// Output.propTypes = {
//   classes: PropTypes.object.isRequired
// }

// export default withStyles(styles)(Output)

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

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
      <div className={classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            onClick={this.run}
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
