import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import {Chip, Paper, TextField, MenuItem, Snackbar} from '@material-ui/core/'
import Notification from './Notification'
import styles from '../styles/InterestSelector'
import deburr from 'lodash/deburr'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'

const suggestions = ['JavaScript', 'Python', 'React', 'Angular', 'Haskell', 
'Functional Programming', 'Object Oriented Programming', 'Java', 'Algorithms', 'Data Structures',
'HTML', 'CSS', 'Go']

function renderInputComponent(inputProps) {
  const {classes, inputRef = () => {}, ref, ...other} = inputProps

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node)
          inputRef(node)
        },
        classes: {
          input: classes.input
        }
      }}
      {...other}
    />
  )
}

function renderSuggestion(suggestion, {query, isHighlighted}) {
  const matches = match(suggestion, query)
  const parts = parse(suggestion, matches)

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{fontWeight: 500}}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{fontWeight: 300}}>
              {part.text}
            </strong>
          )
        })}
      </div>
    </MenuItem>
  )
}



function getSuggestionValue(suggestion) {
  return suggestion
}

class InterestSelector extends Component {
  constructor() {
    super()

    this.state = {
      chipData: [],
      single: '',
      popper: '',
      suggestions: [],
      snackBarOpen: false,
      snackBarVariant: '',
      snackBarMessage: ''
    }
  }

  getSuggestions = value => {
    const inputValue = deburr(value.trim()).toLowerCase()
    const inputLength = inputValue.length
    let count = 0
  
    return inputLength === 0
      ? []
      : suggestions.filter(suggestion => {
          const keep =
            count < 5 &&
            suggestion.slice(0, inputLength).toLowerCase() === inputValue
  
          if (keep) {
            count += 1
          }
  
          return keep
        })
  }

  handleSuggestionsFetchRequested = ({value}) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    })
  }

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  }

  handleChange = name => (event, {newValue}) => {
    this.setState({
      [name]: newValue
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    if (suggestions.includes(this.state.single)) {
      this.setState({... this.state.chipData.push(this.state.single)})
    } else {
      this.setState({
        snackBarOpen: true,
        snackBarVariant: 'warning',
        snackBarMessage: 'Sorry, that is not one of the supported classroom subjects just yet... Try adding one of the built in subjects'
      })
    }

  }

  handleDelete = data => () => {
    this.setState(state => {
      const chipData = [...state.chipData]
      const chipToDelete = chipData.indexOf(data)
      chipData.splice(chipToDelete, 1)
      return {chipData}
    })
  }

  render() {
    const {classes} = this.props

    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion
    }

    return (
      <div className={classes.root}>
      <form onSubmit={this.handleSubmit}>
        <Autosuggest
          {...autosuggestProps}
          inputProps={{
            classes,
            placeholder: 'Enter a subject you are interested in learning about',
            value: this.state.single,
            onChange: this.handleChange('single')
          }}
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion
          }}
          renderSuggestionsContainer={options => (
            <Paper {...options.containerProps} square>
              {options.children}
            </Paper>
          )}
        />
        </form>
        <Paper className={classes.chipContainer}>
          {this.state.chipData.map(data => {
            let icon = null
            return (
              <Chip
                key={this.state.chipData.indexOf(data)}
                icon={icon}
                label={data}
                onDelete={this.handleDelete(data)}
                className={classes.chip}
              />
            )
          })}
        </Paper>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={this.state.snackBarOpen}
          autoHideDuration={4000}
          onClose={this.handleClose}
        >
          <Notification
            onClose={this.handleClose}
            variant={this.state.snackBarVariant}
            message={this.state.snackBarMessage}
          />
        </Snackbar>
      </div>
    )
  }
}

InterestSelector.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(InterestSelector)
