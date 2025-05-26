import Feather from '@expo/vector-icons/Feather';
import { FontAwesome5 } from "@expo/vector-icons";
import { Info, NotePencil } from "phosphor-react-native";
import { AlertIcon } from '@/components/AlertIcon';

export const icon = {
  about: (props: any) => <Info size={props.size} {...props} weight="duotone" />,
  form: (props: any) => <NotePencil size={props.size} {...props} />,
  alert: (props: any) => <AlertIcon isFocused={props.isFocused} size={props.size} />,
  profile: (props: any) => <FontAwesome5 name='user' size={props.size} {...props} />,
  settings: (props: any) => <Feather name="settings" size={props.size} {...props} />,
};