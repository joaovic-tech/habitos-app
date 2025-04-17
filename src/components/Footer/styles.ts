import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  background-color: ${({ theme }) => theme.COLORS.DARK_2};
  padding: 10px 0;
  justify-content: space-around;
  align-items: center;
`;

export const NavItem = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

export const NavText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.COLORS.TEXT_DARK2};
  margin-top: 4px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;

export const CenterButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  margin-top: -30px;
`;

export const CenterIcon = styled.View`
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
  padding: 14px;
  border-radius: 30px;
  align-items: center;
  justify-content: center;
`;
