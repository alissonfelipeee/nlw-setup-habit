import { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { CheckBox } from "../components/CheckBox";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { HabitsEmpty } from "../components/HabitsEmpty";
import clsx from "clsx";

interface HabitParams {
  date: string;
}

interface HabitsInfoProps {
  completedHabits: string[];
  possibleHabits: {
    id: string;
    title: string;
  }[];
}

export function Habit() {
  const [loading, setLoading] = useState(true);
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfoProps | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const route = useRoute();
  const { date } = route.params as HabitParams;

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.isBefore(dayjs(), "day");
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");

  const habitsProgress = habitsInfo?.possibleHabits.length
    ? generateProgressPercentage(
        habitsInfo.possibleHabits.length,
        completedHabits.length
      )
    : 0;

  async function fetchHabits() {
    try {
      setLoading(true);

      const response = await api.get("/day", {
        params: {
          date,
        },
      });

      setHabitsInfo(response.data);
      setCompletedHabits(response.data.completedHabits || []);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Ops...",
        "Não foi possível carregar as nformações dos hábitos"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`/habits/${habitId}/toggle`);

      if (completedHabits.includes(habitId)) {
        setCompletedHabits(completedHabits.filter((id) => id !== habitId));
      } else {
        setCompletedHabits([...completedHabits, habitId]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Ops...", "Não foi possível atualizar status do hábito.");
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View
          className={clsx("mt-6", {
            "opacity-50": isDateInPast,
          })}
        >
          {habitsInfo?.possibleHabits ? (
            habitsInfo.possibleHabits?.map((habit) => (
              <CheckBox
                key={habit.id}
                title={habit.title}
                disabled={isDateInPast}
                checked={completedHabits?.includes(habit.id)}
                onPress={() => handleToggleHabit(habit.id)}
              />
            ))
          ) : (
            <HabitsEmpty />
          )}
        </View>
        {isDateInPast && (
          <Text className="text-white font-semibold mt-4 text-center">
            Você não pode atualizar hábitos de dias passados.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
