import alarmIcon from "@/assets/alarm.png";
import Feather from '@expo/vector-icons/Feather';
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Image } from "react-native";
import { NotePencil } from "phosphor-react-native";

export const icon = {
    info: (props: any) => <FontAwesome name='info-circle' size={props.size} {...props} />,
    form: (props: any) => <NotePencil size={props.size} {...props} />,
    alert: (props: any) => <Image source={alarmIcon} />,
    profile: (props: any) => <FontAwesome5 name='user' size={props.size} {...props} />,
    settings: (props: any) => <Feather name="settings" size={props.size} {...props} />,
}