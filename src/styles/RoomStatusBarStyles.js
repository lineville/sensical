const styles = theme => ({
  root: {
    flexGrow: 1,
    position: 'fixed',
    bottom: 0,
    width: '100%',
    zIndex: 100,
    height: 45
  },
  content: {
    bottom: 13
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
    alignItems: 'center',
    paddingLeft: '15px'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  }
})

export default styles
