import styled from 'styled-components/native'
import { Animated } from 'react-native'

export const AnimatedButton = Animated.createAnimatedComponent(styled.TouchableOpacity<{ selected?: boolean }>`
  justify-content: center;
  align-items: center;
`)

export const FooterContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 85px;
  background-color: ${({ theme }) => theme.COLORS.DARK_2};
`;

export const Button = styled.TouchableOpacity<{ selected: boolean }>`
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ selected }) => selected ? 36 : 0}px;
`;

export const ButtonCircle = styled.View<{ selected: boolean }>`
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 80px;
  height: 80px;
  background-color: ${({ theme, selected }) =>
    selected ? theme.COLORS.DARK : theme.COLORS.DARK_2};
  border-radius: 100%;
`

export const Icon = styled.View<{ selected: boolean }>`
  width: 54px;
  height: 54px;
  background-color: ${({ theme, selected }) =>
    selected ? theme.COLORS.PRIMARY : theme.COLORS.DARK_2};
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  shadow-color: ${({ theme, selected }) => selected ? theme.COLORS.PRIMARY : null};
  elevation: ${({ selected }) => selected ? 10 : 0};
`;

export const Label = styled.Text<{ selected: boolean }>`
  color: ${({ theme, selected }) => selected ? theme.COLORS.LIGHT : theme.COLORS.TEXT_DARK2};
  font-family:  ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONT_SIZE.XL}px;
  margin-top: 4px;
`;