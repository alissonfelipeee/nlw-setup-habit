import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { AppRoutes } from "./app.routes";
import { UserProvider } from "../context/UserContext";

export function Routes() {
  return (
    <View className="flex-1 bg-background">
      <NavigationContainer>
        <UserProvider>
          <AppRoutes />
        </UserProvider>
      </NavigationContainer>
    </View>
  );
}
