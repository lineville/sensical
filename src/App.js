import React, {useEffect, useState} from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import NavMenu from './components/NavMenu'
import Routes from './Routes'
import {ThemeProvider, createMuiTheme} from '@material-ui/core/styles'

const themeConfig = {
  palette: {
    type: 'light',
    primary: {
      main: '#27c5f9',
      dark: '#27c5f9',
    },
    secondary: {
      main: '#000000',
      dark: '#000000',
    },
    default: {
      main: '#ba3112',
      dark: '#ba3112',
    },
  },
  typography: {
    fontFamily: ['Source Sans Pro', 'Roboto Condensed', 'sans-serif'].join(','),
  },
}

const useDarkMode = () => {
  const [theme, setTheme] = useState(themeConfig)

  const {
    palette: {type},
  } = theme

  const toggleDarkMode = () => {
    const updatedTheme = {
      ...theme,
      palette: {
        ...theme.palette,
        type: type === 'light' ? 'dark' : 'light',
      },
    }
    setTheme(updatedTheme)
  }
  return [theme, toggleDarkMode]
}

const App = () => {
  const [theme, toggleDarkMode] = useDarkMode()

  useEffect(() => {
    const ele = document.getElementById('ipl-progress-indicator')
    if (ele) {
      // fade out
      ele.classList.add('available')
      setTimeout(() => {
        // remove from DOM
        ele.remove()
      }, 2000)
    }
  })

  return (
    <ThemeProvider theme={createMuiTheme(theme)}>
      <CssBaseline />
      <NavMenu
        toggleDarkMode={toggleDarkMode}
        isDarkMode={theme.palette.type === 'dark'}
      />
      <Routes />
    </ThemeProvider>
  )
}

export default App
