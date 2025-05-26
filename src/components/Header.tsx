
import { Text, View } from "react-native";

type Props = {
  title?: string;
  icon?: React.ReactElement;
}


export function Header({ title, icon }: Props) {
  return (
    <>
      <View className="items-center px-6 py-3 m-auto bg-white dark:bg-gray-800 rounded-e-lg">
        <Text className="text-xl font-bold text-secondary">Hábitos+</Text>
      </View>

      {title && (
        <View className="flex-row items-center m-auto mt-16 mb-12 border-spacing-2">
          <View className="p-2 mr-2 bg-white rounded dark:bg-gray-800">
            {icon}
          </View>
          <Text className="text-lg font-semibold dark:text-gray-500">{title}</Text>
        </View>
      )}
    </>
  )
};
