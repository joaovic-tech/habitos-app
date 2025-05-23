import Feather from '@expo/vector-icons/Feather';
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { NotePencil } from "phosphor-react-native";
import { AlertIcon } from '@/components/AlertIcon';

export const icon = {
  info: (props: any) => <FontAwesome name='info-circle' size={props.size} {...props} />,
  form: (props: any) => <NotePencil size={props.size} {...props} />,
  alert: (props: any) => <AlertIcon isFocused={props.isFocused} size={props.size} />,
  profile: (props: any) => <FontAwesome5 name='user' size={props.size} {...props} />,
  settings: (props: any) => <Feather name="settings" size={props.size} {...props} />,
};