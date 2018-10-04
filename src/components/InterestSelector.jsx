import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import {Chip, Paper, TextField, MenuItem} from '@material-ui/core/'
import styles from '../styles/InterestSelector'
import deburr from 'lodash/deburr'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'

const suggestions = [
  {label: 'React'},
  {label: 'Angular'},
  {label: 'Ember'},
  {label: 'JavaScript'},
  {label: 'CSS'},
  {label: 'Python'}
]

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
  const matches = match(suggestion.label, query)
  const parts = parse(suggestion.label, matches)

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

function getSuggestions(value) {
  const inputValue = deburr(value.trim()).toLowerCase()
  const inputLength = inputValue.length
  let count = 0

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.label.slice(0, inputLength).toLowerCase() === inputValue

        if (keep) {
          count += 1
        }

        return keep
      })
}

function getSuggestionValue(suggestion) {
  return suggestion.label
}

class InterestSelector extends Component {
  constructor() {
    super()

    this.state = {
      chipData: [
        {key: 0, label: 'Angular'},
        {key: 1, label: 'jQuery'},
        {key: 2, label: 'Polymer'},
        {key: 3, label: 'React'},
        {key: 4, label: 'Vue.js'}
      ],
      single: '',
      popper: '',
      suggestions: []
    }
  }
  handleSuggestionsFetchRequested = ({value}) => {
    this.setState({
      suggestions: getSuggestions(value)
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
        <Paper className={classes.chipContainer}>
          {this.state.chipData.map(data => {
            let icon = null
            return (
              <Chip
                key={data.key}
                icon={icon}
                label={data.label}
                onDelete={this.handleDelete(data)}
                className={classes.chip}
              />
            )
          })}
        </Paper>
      </div>
    )
  }
}

InterestSelector.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(InterestSelector)
