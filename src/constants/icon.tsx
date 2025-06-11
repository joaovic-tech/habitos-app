import { Info, NotePencil, User, Gear } from "phosphor-react-native";
import { AlertIcon } from "@/components/AlertIcon";

// Tipo base para props de ícones
export interface BaseIconProps {
  size?: number;
  color?: string;
  isFocused?: boolean;
}

export const icon = {
  about: (props: any) => <Info size={props.size} {...props} weight="duotone" />,
  form: (props: any) => <NotePencil size={props.size} {...props} weight="duotone" />,
  index: (props: any) => (
    <AlertIcon isFocused={props.isFocused} size={props.size} />
  ),
  profile: (props: any) => (
    <User size={props.size} {...props} weight="duotone" />
  ),
  settings: (props: any) => (
    <Gear size={props.size} {...props} weight="duotone" />
  ),
};
