import { ThemeProvider } from 'styled-components/native'

import theme from './src/theme'
import MainScreen from '@screens/MainScreen'

export default function App () {
  return (
    <ThemeProvider theme={theme}>
      <MainScreen />
    </ThemeProvider>
  )
}
