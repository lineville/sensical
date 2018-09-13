import React, {Component} from 'react'

import NavMenu from './components/NavMenu'
import Routes from './Routes'

import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#27c5f9'
    },
    secondary: {
      main: '#000000'
    },
    default: {
      main: '#ba3112'
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
