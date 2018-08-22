const styles = theme => ({
  root: {
    flexGrow: 1,
    position: 'fixed',
    bottom: 0,
    width: '100%',
    zIndex: 100
  },
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  },
  text: {
    fontSize: 14,
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  }
})

export default styles
