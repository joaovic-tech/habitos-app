import React from "react";
import { View } from "react-native";
import RegisterForm from "@/components/forms/RegisterForm";

interface RegisterProps {
  onBack: () => void;
}

export default function Register({ onBack }: RegisterProps) {
  return (
    <View className="w-full">
      <RegisterForm onBack={onBack} />
    </View>
  );
}
