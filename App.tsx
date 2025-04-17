import { ThemeProvider } from 'styled-components/native'

import theme from './src/theme'
import { Alerts } from '@screens/Alerts'

export default function App () {
  return (
    <ThemeProvider theme={theme}>
      <Alerts />
    </ThemeProvider>
  )
}
