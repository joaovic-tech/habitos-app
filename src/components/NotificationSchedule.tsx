import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Bell } from "phosphor-react-native";
import { colorScheme } from "nativewind";
import { colors } from "@/styles/colors";
import { calculateAlertTimes } from "@/services/HabitSchedulerService";

interface NotificationScheduleProps {
  startTime: Date;
  endTime: Date;
  alertsPerDay: number;
}

export default function NotificationSchedule({
  startTime,
  endTime,
  alertsPerDay,
}: NotificationScheduleProps) {
  const isDarkMode = colorScheme.get() === "dark";

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const notificationDateTimes = calculateAlertTimes(
    startTime,
    endTime,
    alertsPerDay
  );
  const notificationTimes = notificationDateTimes.map(formatTime);

  return (
    <View className="mb-6">
      <View className="flex-row items-center mb-3">
        <Bell
          size={20}
          color={isDarkMode ? colors.white : colors.gray}
          weight="fill"
        />
        <Text className="ml-2 text-lg font-dosis-semibold text-neutral-900 dark:text-white">
          Horários das Notificações
        </Text>
      </View>

      <View className="p-4 bg-white border border-neutral-200 rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
        <Text className="mb-3 text-sm font-dosis-medium text-neutral-600 dark:text-neutral-400">
          Você receberá {alertsPerDay}{" "}
          {alertsPerDay === 1 ? "lembrete" : "lembretes"} por dia:
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4 }}
        >
          <View className="flex-row gap-3">
            {notificationTimes.map((time, index) => (
              <View
                key={index}
                className="items-center justify-center px-4 py-3 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/30 dark:border-blue-700"
              >
                <Text className="text-sm text-blue-800 font-dosis-bold dark:text-blue-200">
                  {time}
                </Text>
                <Text className="text-xs text-blue-600 font-dosis-medium dark:text-blue-300">
                  {index + 1}º lembrete
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View className="p-3 mt-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <Text className="text-xs text-center text-blue-700 font-dosis-medium dark:text-blue-300">
            {alertsPerDay === 1
              ? `💡 Lembrete no meio do período (${formatTime(
                  startTime
                )} - ${formatTime(endTime)})`
              : alertsPerDay === 2
              ? `💡 Lembretes nos horários de início (${formatTime(
                  startTime
                )}) e fim (${formatTime(endTime)})`
              : `💡 Lembretes no início, fim e distribuídos uniformemente entre ${formatTime(
                  startTime
                )} e ${formatTime(endTime)}`}
          </Text>
        </View>
      </View>
    </View>
  );
}
