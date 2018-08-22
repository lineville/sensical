const styles = theme => ({
  card: {
    maxWidth: 275,
    position: 'absolute'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  messages: {
    height: 175,
    overflow: 'scroll'
  },
  button: {
    margin: theme.spacing.unit
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  form: {
    display: 'flex'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
})

export default styles
