import { Text, ScrollView } from "react-native";
import React from "react";
import Login from "@/components/forms/Login";
import { ToastProvider } from "@/components/shared/Toast";

const userExists = false; // Simula se o usuário está logado ou não

export default function Tab() {
  return (
    <ToastProvider>
      {!userExists ? (
        <Login />
      ) : (
        <ScrollView className="flex-1 px-6 bg-gray-200 dark:bg-gray-900">
          <Text className="text-green-500">Profile Screen</Text>
        </ScrollView>
      )}
    </ToastProvider>
  );
}
