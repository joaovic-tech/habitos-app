import { ThemeProvider } from 'styled-components/native'
import {
  useFonts,
  Dosis_400Regular,
  Dosis_700Bold
} from '@expo-google-fonts/dosis'

import theme from './src/theme'
import MainScreen from '@screens/MainScreen'
import { ActivityIndicator, StatusBar } from 'react-native'

export default function App () {
  const [fontsLoaded] = useFonts({ Dosis_400Regular, Dosis_700Bold })

  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      />

      {fontsLoaded ? <MainScreen /> : <ActivityIndicator />}
    </ThemeProvider>
  )
}
