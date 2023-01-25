import { View, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import colors from "tailwindcss/colors";

import Logo from "../assets/logo.svg";

export function Header() {
  const { navigate } = useNavigation();

  return (
    <View className="w-full flex-row items-center justify-between">
      <Logo />

      <TouchableOpacity
        activeOpacity={0.7}
        className="flex-row h-11 px-4 rounded-lg items-center"
        onPress={() => navigate("profile")}
      >
        <Feather name="settings" size={20} color={colors.violet[500]} />
      </TouchableOpacity>
    </View>
  );
}
