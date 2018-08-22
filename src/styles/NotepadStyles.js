const styles = theme => ({
  card: {
    minWidth: 275,
    position: 'absolute'
  },
  button: {
    margin: theme.spacing.unit
  },
  textArea: {
    width: '100%',
    maxHeight: '500px',
    height: '-webkit-fill-available',
    border: '1px dotted'
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between'
  }
})

export default styles
