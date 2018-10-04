import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import InterestSelector from './InterestSelector'
import {
  Stepper,
  FormControlLabel,
  Checkbox,
  Step,
  StepLabel,
  Button,
  Typography
} from '@material-ui/core/'
import styles from '../styles/QuestionnaireStepperStyles'

function getSteps() {
  return ['Role', 'Interests', 'Skill Level']
}

class QuestionnaireStepper extends Component {
  constructor() {
    super()
    this.state = {
      activeStep: 0,
      skipped: new Set(),
      isLearner: false,
      isTeacher: false
    }
  }

  handleChange = event => {
    this.setState({[event.target.name]: event.target.checked})
  }

  getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <div className="center">
            <p>Are you a learner or a teacher?</p>
            <FormControlLabel
              control={
                <Checkbox
                  name="isLearner"
                  checked={this.state.isLearner}
                  onChange={this.handleChange}
                  value={this.state.isLearner}
                  color="primary"
                />
              }
              label="Learner"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="isTeacher"
                  checked={this.state.isTeacher}
                  onChange={this.handleChange}
                  value={this.state.isTeacher}
                  color="secondary"
                />
              }
              label="Teacher"
            />
          </div>
        )
      case 1:
        return (
          <div className="center">
            <p>Which of the following subjects are you interested in?</p>
            <InterestSelector />
          </div>
        )
      case 2:
        return (
          <div className="center">
            <p>
              How much experience do you have in the subjects you are
              interested?
            </p>
          </div>
        )
      default:
        return 'Unknown step'
    }
  }

  handleNext = () => {
    const {activeStep} = this.state
    let {skipped} = this.state
    if (this.isStepSkipped(activeStep)) {
      skipped = new Set(skipped.values())
      skipped.delete(activeStep)
    }
    this.setState({
      activeStep: activeStep + 1,
      skipped
    })
  }

  handleBack = () => {
    const {activeStep} = this.state
    this.setState({
      activeStep: activeStep - 1
    })
  }

  handleSkip = () => {
    const {activeStep} = this.state

    this.setState(state => {
      const skipped = new Set(state.skipped.values())
      skipped.add(activeStep)
      return {
        activeStep: state.activeStep + 1,
        skipped
      }
    })
  }

  handleReset = () => {
    this.setState({
      activeStep: 0
    })
  }

  isStepSkipped(step) {
    return this.state.skipped.has(step)
  }

  render() {
    const {classes} = this.props
    const steps = getSteps()
    const {activeStep} = this.state

    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const props = {}
            const labelProps = {}

            if (this.isStepSkipped(index)) {
              props.completed = false
            }
            return (
              <Step key={label} {...props}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            )
          })}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <div>
              <Typography className={classes.instructions}>
                All steps completed - you&quot;re finished
              </Typography>
              <Button onClick={this.handleReset} className={classes.button}>
                Reset
              </Button>
            </div>
          ) : (
            <div>
              <Typography className={classes.instructions}>
                {this.getStepContent(activeStep)}
              </Typography>
              <div className="center">
                <Button
                  disabled={activeStep === 0}
                  onClick={this.handleBack}
                  className={classes.button}
                >
                  Back
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleNext}
                  className={classes.button}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

QuestionnaireStepper.propTypes = {
  classes: PropTypes.object
}

export default withStyles(styles)(QuestionnaireStepper)
