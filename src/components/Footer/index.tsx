import React, { useEffect, useRef } from 'react'
import {
  FooterContainer,
  ButtonCircle,
  Label,
  Icon,
  AnimatedButton
} from './styles'
import { Alarm, Info, Lightbulb, Sun, User } from 'phosphor-react-native'
import theme from '../../theme'
import { Animated } from 'react-native'

interface FooterProps {
  onSelect: (screen: string) => void
  selected: string
}

const BUTTONS = [
  { key: 'info', label: 'Info', IconComp: Info },
  { key: 'dicas', label: 'Dicas', IconComp: Lightbulb },
  { key: 'Alerts', label: 'Alerts', IconComp: Alarm },
  { key: 'perfil', label: 'Perfil', IconComp: User }
]

export function Footer ({ onSelect, selected }: FooterProps) {
  const animatedValues = useRef<{ [key: string]: Animated.Value }>({})

  // Inicializa os valores animados
  BUTTONS.forEach(({ key }) => {
    if (!animatedValues.current[key]) {
      animatedValues.current[key] = new Animated.Value(0)
    }
  })

  // Quando mudar a seleção, anima o botão selecionado
  useEffect(() => {
    BUTTONS.forEach(({ key }) => {
      Animated.timing(animatedValues.current[key], {
        toValue: key === selected ? 30 : 0,
        duration: 100,
        useNativeDriver: false
      }).start()
    })
  }, [selected])

  return (
    <FooterContainer>
      {BUTTONS.map(({ key, label, IconComp }) => (
        <AnimatedButton
          key={key}
          onPress={() => onSelect(key)}
          style={{ marginBottom: animatedValues.current[key] }}
        >
          <ButtonCircle selected={selected === key}>
            <Icon selected={selected === key}>
              <IconComp
                size={28}
                weight='regular'
                color={
                  selected === key ? theme.COLORS.LIGHT : theme.COLORS.TEXT_DARK
                }
              />
            </Icon>
          </ButtonCircle>
          {selected === key && <Label selected>{label}</Label>}
        </AnimatedButton>
      ))}

      <AnimatedButton onPress={() => console.log('trocar de theme')}>
        <Icon selected={false}>
          <Sun size={28} weight='regular' color={theme.COLORS.TEXT_DARK} />
        </Icon>
      </AnimatedButton>
    </FooterContainer>
  )
}
