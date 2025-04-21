import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function Info () {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Info</Text>
      {/* conteúdo da tela */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: '#FFF',
    fontSize: 22
  }
})
