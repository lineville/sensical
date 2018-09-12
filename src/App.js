import React, {Component} from 'react'

import NavMenu from './components/NavMenu'
import Routes from './Routes'

import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#3A0D27'
    },
    secondary: {
      main: '#414654'
    }
  },
  typography: {
    fontFamily: ['Source Sans Pro', 'Roboto Condensed', 'sans-serif'].join(',')
  }
})

class App extends Component {
  componentDidMount() {
    const ele = document.getElementById('loader')
    if (ele) {
      ele.outerHTML = ''
    }
  }
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <NavMenu />
        <Routes />
      </MuiThemeProvider>
    )
  }
}

export default App
