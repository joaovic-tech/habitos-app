import { Text, ScrollView, Image, View, TouchableOpacity } from "react-native";
import { useCallback, useState } from "react";
import Login from "../login";
import { Header } from "@/components/shared/Header";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/Avatar";
import { Button } from "@/components/shared/Button";
import { PencilSimpleLine, SignOut } from "phosphor-react-native";
import * as Habits from "@/storage/habitsStorage";
import { useFocusEffect } from "expo-router";
import { useColorScheme } from "nativewind";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Tab() {
  const [userHabits, setUserHabits] = useState<Habits.Habit[]>([]);
  const { colorScheme } = useColorScheme();

  // Helper function for avatar initials
  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.split(" ").filter(Boolean);

    if (parts.length === 0) return "";
    const firstInitial = parts[0][0]?.toUpperCase() || "";
    if (parts.length === 1) return firstInitial;
    const lastInitial = parts[parts.length - 1][0]?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}`;
  };

  const user = {
    name: "Usuário",
    email: "user.email@example.com",
    habits: {
      userHabits,
      activeHabits: userHabits.filter((habit) => habit.status),
      inactiveHabits: userHabits.filter((habit) => !habit.status),
      totalHabits: userHabits.length,
    },
    avatarUrl: "https://avatars.githubusercontent.com/u/123456789?v=4",
    token: null, // Simulated token for authentication
  };

  const getHabits = async () => {
    const habits = await Habits.getAll();
    setUserHabits(habits);
  };

  useFocusEffect(
    useCallback(() => {
      getHabits();
    }, [])
  );

  const starImageSource =
    colorScheme === "dark"
      ? require("@/assets/Star.png")
      : require("@/assets/Star-dark.png");

  return (
    <>
      {!user.token ? (
        <Login />
      ) : (
        <SafeAreaProvider>
          <SafeAreaView className="flex-1 px-6 pt-safe bg-neutral-200 dark:bg-neutral-900">
            <Image
              source={starImageSource}
              className="absolute top-0 right-0 w-screen h-screen"
              resizeMode="stretch"
            />

            <ScrollView className="max-[380px]:mb-12">
              <Header title="Perfil" />

              <View className="flex-col gap-8 mt-4 max-[380px]:gap-4">
                <View className="gap-2">
                  <View className="relative mx-auto">
                    <Avatar className="w-40 h-40 max-[380px]:w-28 max-[380px]:h-28 border shadow-lg shadow-black border-neutral-50 dark:border-neutral-700">
                      <AvatarImage
                        source={{
                          uri: `${user.avatarUrl}`,
                        }}
                      />
                      <AvatarFallback textClassname="text-2xl max-[380px]:text-xl font-dosis-medium text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <TouchableOpacity
                      onPress={() => console.log("editar perfil")}
                      className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full shadow-lg min-[380px]:hidden"
                    >
                      <PencilSimpleLine size={22} color="white" weight="bold" />
                    </TouchableOpacity>
                  </View>

                  <View className="items-center gap-2 max-[380px]:gap-0">
                    <Text className="text-3xl max-[380px]:text-2xl font-dosis-bold text-neutral-800 dark:text-neutral-100">
                      {user.name}
                    </Text>
                    <Text className="text-lg font-dosis-semibold text-neutral-600 dark:text-neutral-400">
                      {user.email}
                    </Text>
                  </View>
                </View>

                {user.habits.totalHabits > 0 && (
                  <View className="p-6 bg-white shadow-md rounded-xl dark:bg-neutral-800 max-[380px]:p-2">
                    <Text className="mb-5 max-[380px]:mb-2.5 text-xl text-center font-dosis-semibold text-neutral-700 dark:text-neutral-200">
                      Progresso dos Hábitos
                    </Text>
                    <View className="flex-row justify-around">
                      <View className="items-center">
                        <Text className="text-4xl text-blue-600 font-dosis-bold">
                          {user.habits.activeHabits.length}
                        </Text>
                        <Text className="mt-1 text-sm text-neutral-500 font-dosis-semibold dark:text-neutral-300">
                          Ativos
                        </Text>
                      </View>

                      {user.habits.inactiveHabits.length > 0 && (
                        <View className="items-center opacity-70">
                          <Text className="text-4xl font-dosis-bold text-neutral-500">
                            {user.habits.inactiveHabits.length}
                          </Text>
                          <Text className="mt-1 text-sm text-neutral-500 font-dosis-semibold dark:text-neutral-300">
                            Inativos
                          </Text>
                        </View>
                      )}

                      <View className="items-center">
                        <Text className="text-4xl text-green-500 font-dosis-bold ">
                          {user.habits.totalHabits}
                        </Text>
                        <Text className="mt-1 text-sm font-dosis-semibold text-neutral-500 dark:text-neutral-300">
                          Total
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                <View className="flex-col gap-4">
                  <Button
                    label="Editar perfil"
                    variant="ghost"
                    className="max-[380px]:hidden"
                  />
                  <Button
                    label="Sair"
                    variant="destructive" // Assuming primary is not red, we add classes
                    icon={<SignOut size={20} color="white" weight="duotone" />}
                  />
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </SafeAreaProvider>
      )}
    </>
  );
}
