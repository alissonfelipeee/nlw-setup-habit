import {
  TouchableOpacity,
  View,
  Text,
  TouchableOpacityProps,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut} from "react-native-reanimated";
import colors from "tailwindcss/colors";
import clsx from "clsx";

interface CheckBoxProps extends TouchableOpacityProps {
  title: string;
  checked?: boolean;
}

export function CheckBox(props: CheckBoxProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="flex-row mb-2 items-center"
      {...props}
    >
      {props.checked ? (
        <Animated.View
          className="w-8 h-8 bg-green-500 rounded-lg items-center justify-center"
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Feather name="check" size={20} color={colors.white} />
        </Animated.View>
      ) : (
        <View className="w-8 h-8 bg-zinc-900 rounded-lg" />
      )}

      <Text className={clsx(
        "text-white text-base ml-3 font-semibold",
        { "line-through text-zinc-400": props.checked}
      )}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
}
