import Alerts from '@components/Alerts'
import Dicas from '@components/Dicas'
import { Footer } from '@components/Footer'
import Info from '@components/Info'
import Perfil from '@components/Perfil'
import React, { useState } from 'react'
import { View, StyleSheet, Animated } from 'react-native'

export default function MainScreen () {
  const [selected, setSelected] = useState('alertas')
  const fadeAnim = new Animated.Value(1)

  const renderContent = () => {
    switch (selected) {
      case 'dicas':
        return <Dicas />
      case 'perfil':
        return <Perfil />
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
    backgroundColor: '#121214',
    justifyContent: 'space-between'
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20
  }
})
