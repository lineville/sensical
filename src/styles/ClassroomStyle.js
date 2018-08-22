const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: '350px',
    backgroundColor: 'rgba(171,197,170, 0.2)'
  },
  room: {
    flexGrow: 1,
    height: '100vh'
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  card: {
    minWidth: 275
  },
  pos: {
    marginBottom: 12
  }
})

export default styles
