import Alerts from '@components/Alerts'
import Tips from '@components/Tips'
import Footer from '@components/Footer'
import Info from '@components/Info'
import Profile from '@components/Profile'
import React, { useState } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import theme from '../theme'

export default function MainScreen () {
  const [selected, setSelected] = useState('alerts')
  const fadeAnim = new Animated.Value(1)

  const renderContent = () => {
    switch (selected) {
      case 'tips':
        return <Tips />
      case 'profile':
        return <Profile />
      case 'info':
        return <Info />
      default:
        return <Alerts />
    }
  }

  const handleSelect = (screen: string) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true
      })
    ]).start()

    setSelected(screen)
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {renderContent()}
      </Animated.View>
      <Footer onSelect={handleSelect} selected={selected} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.DARK,
    justifyContent: 'space-between'
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20
  }
})
