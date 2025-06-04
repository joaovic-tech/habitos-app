import React from "react";
import { View } from "react-native";

interface RegisterProps {
  onBack: () => void;
}

export default function Register({ onBack }: RegisterProps) {
  return (
    <View className="w-full">
      <Register onBack={onBack} />
    </View>
  );
}
