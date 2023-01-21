import { useEffect } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, WithTimingConfig } from "react-native-reanimated";

interface ProgressBarProps {
  progress?: number;
}

export function ProgressBar({ progress = 0 }: ProgressBarProps) {
  const sharedProgress = useSharedValue(progress);

  const style = useAnimatedStyle(() => ({
    width: `${sharedProgress.value}%`,
  }));

  useEffect(() => {
    sharedProgress.value = withTiming(progress, { duration: 700 } as WithTimingConfig);
  }, [progress]);

  return (
    <View className="w-full h-3 rounded-xl bg-zinc-700 mt-4">
      <Animated.View
        className="h-3 rounded-xl bg-violet-600"
        style={style}
      />
    </View>
  );
}
