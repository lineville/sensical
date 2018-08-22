const parallaxStyle = {
  parallax: {
    maxHeight: '1000px',
    overflow: 'hidden',
    position: 'relative',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    paddingTop: '15px',
    border: '0',
    display: 'flex',
    alignItems: 'center',
    backgroundImage: 'linear-gradient(to top, #9890e3 0%, #b1f4cf 100%)'
  },
  filter: {
    '&:before': {
      background: 'rgba(0, 0, 0, 0.5)'
    },
    '&:after,&:before': {
      position: 'absolute',
      zIndex: '1',
      width: '100%',
      height: '100%',
      display: 'block',
      left: '0',
      top: '0',
      content: "''"
    }
  },
  small: {
    height: '380px'
  }
}

export default parallaxStyle
