import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import Form from "./Form";

interface RegisterProps {
  onBack: () => void;
}

export default function Register({ onBack }: RegisterProps) {
  return (
    <View className="w-full">
      <Form onBack={onBack} />
    </View>
  );
}

