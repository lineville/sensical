const styles = theme => ({
  message: {
    padding: 7
  },
  sender: {
    fontSize: 10
  },
  bubble: {
    margin: 5,
    padding: 5,
    border: '1px solid ' + theme.palette.primary.main,
    color: theme.palette.primary.main,
    borderRadius: 5
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between'
  }
})

export default styles
