import React from 'react'

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

const App = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <NavMenu />
      <Routes />
    </MuiThemeProvider>
  )
}

export default App
