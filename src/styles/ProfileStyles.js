import parallaxStyle from './ParallaxStyle'

const styles = (theme) => ({
  row: {
    display: 'flex',
  },
  avatar: {
    margin: 50,
  },
  bigAvatar: {
    width: 150,
    height: 150,
  },
  card: {
    maxWidth: 345,
  },
  margin: {
    margin: theme.spacing(1),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  ...parallaxStyle,
})

export default styles
