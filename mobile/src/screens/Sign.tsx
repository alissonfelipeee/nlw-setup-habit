import { View, TouchableOpacity, Text } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

import Logo from "../assets/logo.svg";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import { Context } from "../context/UserContext";

export function Sign() {
  const { navigate } = useNavigation();

  const { user } = useContext(Context);

  useEffect(() => {
    if (user) {
      navigate("home");
    }
  }, [user]);

  async function handleSignIn() {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const { idToken } = await GoogleSignin.signIn();

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View className="flex-1 items-center justify-between bg-background px-8 py-16">
      <Logo />
      <TouchableOpacity
        activeOpacity={0.7}
        className="w-full border-2 border-violet-500 font-semibold rounded-lg px-6 py-4 flex items-center"
        onPress={handleSignIn}
      >
        <Text className="text-white font-semibold text-base">Conectar-se</Text>
      </TouchableOpacity>
    </View>
  );
}
