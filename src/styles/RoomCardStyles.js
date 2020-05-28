const styles = (theme) => ({
  card: {
    maxWidth: 300,
    margin: '2%',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  rightIcon: {
    marginLeft: theme.spacing(1) * 0.5,
  },
  button: {
    margin: theme.spacing(1) * 0.5,
  },
})

export default styles
