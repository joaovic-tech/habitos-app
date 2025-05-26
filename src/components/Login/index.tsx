import { Header } from "@/components/Header";
import { Image, ScrollView, Text, View } from "react-native";
import Form from "./form";

export default function Login() {
  return (
    <ScrollView className="flex-1 bg-gray-200 dark:bg-gray-900">
      {/* <Header /> */} 

      {/* Top */}
      <View className="flex items-center justify-start w-full gap-4 pt-5 text-center h-80 bg-primary">
        <Image source={require('@/assets/Star.png')} className="absolute"/>
        <Text className="text-4xl font-bold text-center text-gray-500">
          Entre na sua{'\n'}conta
        </Text>
        <Text className="text-base text-gray-500">Digite seu e-mail senha para fazer login</Text>
      </View>

      <Form />

    </ScrollView>
  )
};
