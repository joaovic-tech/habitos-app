import React from 'react'
import { Container, NavItem, NavText, CenterButton, CenterIcon } from './styles'
import { Info, Lightbulb, Alarm, User, SignOut } from 'phosphor-react-native'
import { useTheme } from 'styled-components/native'

export function Footer () {
  const theme = useTheme()

  return (
    <Container>
      <NavItem>
        <Info size={32} color={theme.COLORS.TEXT_DARK2} weight='regular' />
      </NavItem>

      <NavItem>
        <Lightbulb size={32} color={theme.COLORS.TEXT_DARK2} weight='regular' />
      </NavItem>

      <CenterButton>
        <CenterIcon>
          <Alarm size={32} color='#FFF' weight='fill' />
        </CenterIcon>
        <NavText style={{ color: '#FFF' }}>Alertas</NavText>
      </CenterButton>

      <NavItem>
        <User size={32} color={theme.COLORS.TEXT_DARK2} weight='regular' />
      </NavItem>

      <NavItem>
        <SignOut size={32} color={theme.COLORS.TEXT_DARK2} weight='regular' />
      </NavItem>
    </Container>
  )
}
