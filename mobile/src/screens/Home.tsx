import { useCallback, useContext, useState } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import colors from "tailwindcss/colors";
import { Feather } from "@expo/vector-icons";
import dayjs from "dayjs";

import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import { api } from "../lib/axios";
import { Context } from "../context/UserContext";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const datesFromYearStart = generateDatesFromYearBeginning();
const minimumSummaryDatesSize = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length;

type Summary = {
  id: string;
  date: string;
  completedHabits: number;
  amountOfHabits: number;
}[];

export function Home() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary | null>(null);

  const { navigate } = useNavigation();
  const { user } = useContext(Context);

  async function fetchData() {
    try {
      setLoading(true);
      const response = await api.get("/summary", {
        params: {
          email: user!.email,
        },
      });
      setSummary(response.data);
    } catch (error) {
      Alert.alert("Ops", "Não foi possível carregar o sumário de hábitos.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 py-16">
      <Header />
      <View className="flex items-start mt-2">
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row h-11 px-4 border-2 border-violet-500 rounded-lg items-center"
          onPress={() => navigate("newHabit")}
        >
          <Feather name="plus" size={20} color={colors.violet[500]} />

          <Text className="text-white ml-3 font-semibold text-base">Novo</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row mt-6 mb-2">
        {weekDays.map((day, index) => (
          <Text
            key={`${day}-${index}`}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: DAY_SIZE }}
          >
            {day}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {summary && (
          <View className="flex-row flex-wrap">
            {datesFromYearStart.map((date) => {
              const dayWithhabits = summary.find((day) => {
                return dayjs(date).isSame(dayjs(day.date), "day");
              });

              return (
                <HabitDay
                  key={date.toISOString()}
                  date={date}
                  completedHabits={dayWithhabits?.completedHabits}
                  amountOfHabits={dayWithhabits?.amountOfHabits}
                  onPress={() =>
                    navigate("habit", { date: date.toISOString() })
                  }
                />
              );
            })}

            {amountOfDaysToFill > 0 &&
              Array.from({ length: amountOfDaysToFill }).map((_, index) => (
                <View
                  key={index}
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-50"
                  style={{ width: DAY_SIZE, height: DAY_SIZE }}
                />
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
