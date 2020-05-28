const styles = (theme) => ({
  card: {
    minWidth: 275,
    position: 'absolute',
  },
  button: {
    margin: theme.spacing(1),
  },
  textArea: {
    width: '100%',
    height: '175px',
    maxHeight: '500px',
    // height: '-webkit-fill-available',
    border: '1px dotted',
    backgroundColor: theme.palette.type === 'dark' ? '#272822' : '#ffffff',
    color: theme.palette.type === 'dark' ? '#ffffff' : '#000000',
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
})

export default styles
