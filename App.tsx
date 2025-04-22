import { ThemeProvider } from 'styled-components/native'

import theme from './src/theme'
import MainScreen from '@screens/MainScreen'
import { StatusBar } from 'react-native'

export default function App () {
  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      />

      <MainScreen />
    </ThemeProvider>
  )
}
