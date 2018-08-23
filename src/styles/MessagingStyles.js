const styles = theme => ({
  card: {
    width: 275,
    position: 'absolute'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '-webkit-fill-available'
  },
  messages: {
    overflow: 'scroll'
  },
  button: {
    margin: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  form: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between'
  }
})

export default styles
