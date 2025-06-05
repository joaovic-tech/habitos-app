import { Text, ScrollView } from "react-native";
import React from "react";
import Login from "../login";

const userExists = false; // Simula se o usuário está logado ou não

export default function Tab() {
  return (
    <>
      {!userExists ? (
        <Login />
      ) : (
        <ScrollView className="flex-1 px-6 bg-neutral-200 dark:bg-neutral-900">
          <Text className="text-green-500">Profile Screen</Text>
        </ScrollView>
      )}
    </>
  );
}
