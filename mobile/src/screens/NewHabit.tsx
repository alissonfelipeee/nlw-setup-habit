import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import colors from "tailwindcss/colors";

import { BackButton } from "../components/BackButton";
import { CheckBox } from "../components/CheckBox";
import { api } from "../lib/axios";

const availableWeekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export function NewHabit() {
  const [title, setTitle] = useState("");
  const [weekDays, setWeekDays] = useState<number[]>([]);

  function handleToggleWeekDay(dayIndex: number) {
    if (weekDays.includes(dayIndex)) {
      setWeekDays((prevState) => prevState.filter((day) => day !== dayIndex));
    } else {
      setWeekDays((prevState) => [...prevState, dayIndex]);
    }
  }

  async function handleCreateNewHabit() {
    try {
      if (!title.trim() || weekDays.length === 0) {
        return Alert.alert(
          "Ops...",
          "Você precisa informar um título para o hábito e selecionar pelo menos um dia da semana."
        );
      }

      await api.post("/habits", {
        title,
        weekDays,
      });

      setTitle("");
      setWeekDays([]);

      Alert.alert("Sucesso!", "Hábito criado com sucesso.");
    } catch (error) {
      console.log(error);
      Alert.alert("Ops...", "Não foi possível criar o hábito.");
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <BackButton />
        <Text className="mt-6 text-white font-extrabold text-3xl">
          Novo hábito
        </Text>
        <Text className="mt-6 text-white font-semibold text-base">
          Qual seu comprometimento?
        </Text>

        <TextInput
          className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
          placeholder="Ex.: Exercícios, dormir bem, etc..."
          placeholderTextColor={colors.zinc[400]}
          onChangeText={setTitle}
          value={title}
        />

        <Text className="font-semibold mt-4 mb-3 text-white text-base">
          Em quais dias da semana?
        </Text>

        {availableWeekDays.map((day, index) => (
          <CheckBox
            key={day}
            title={day}
            checked={weekDays.includes(index)}
            onPress={() => handleToggleWeekDay(index)}
          />
        ))}

        <TouchableOpacity
          className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-4"
          activeOpacity={0.7}
          onPress={handleCreateNewHabit}
        >
          <Feather name="check" size={20} color={colors.white} />
          <Text className="font-semibold text-base text-white ml-2">
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
