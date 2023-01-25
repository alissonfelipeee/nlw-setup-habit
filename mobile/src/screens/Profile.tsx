import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { Text, TouchableOpacity, View } from "react-native";
import { BackButton } from "../components/BackButton";

export function Profile() {

  function handleSignOut() {
    GoogleSignin.signOut();
    auth().signOut();
  }

  return (
    <View className="flex-1 justify-between bg-background px-8 py-16">
      <BackButton />
      <TouchableOpacity
        activeOpacity={0.7}
        className="border-2 border-violet-500 font-semibold rounded-lg px-6 py-4 flex items-center"
        onPress={handleSignOut}
      >
        <Text className="text-white font-semibold text-base">
          Desconectar-se
        </Text>
      </TouchableOpacity>
    </View>
  );
}
