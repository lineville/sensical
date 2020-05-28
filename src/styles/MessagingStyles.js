const styles = (theme) => ({
  card: {
    width: 275,
    position: 'absolute',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '-webkit-fill-available',
  },
  messages: {
    overflow: 'scroll',
  },
  button: {
    margin: theme.spacing(1),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  form: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
})

export default styles
