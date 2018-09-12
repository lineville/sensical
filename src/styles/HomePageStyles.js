const styles = () => ({
  infoCard: {
    margin: '8%',
    padding: '2%',
    maxWidth: '380px',
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'rgba(45, 45, 45, .8)',
    borderRadius: '5px',
    fontSize: '18px',
    color: 'white'
  },
  info: {
    margin: '0 10%',
    padding: '550px 0 50px 0'
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, .6)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, .4)'
    }
  }
})

export default styles
