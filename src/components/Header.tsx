import { colors } from "@/styles/colors";
import { FontAwesome } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Props = {
  title?: string;
  icon: any;
}


export function Header({ title, icon }: Props) {
  return (
    <>
      <View className="items-center px-6 py-3 m-auto mb-24 bg-background2 rounded-e-lg">
        <Text className="text-xl font-bold text-secondary">Hábitos+</Text>
      </View>

      {title && (
        <View className="flex-row items-center m-auto mb-12 border-spacing-2">
          <FontAwesome name={icon} size={20} color={colors.secondary} className="p-2 mr-2 rounded bg-background2" />
          <Text className="text-lg font-semibold text-white">{title}</Text>
        </View>
      )}
    </>
  )
};
