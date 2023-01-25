import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { Context } from "../context/UserContext";
import { Habit } from "../screens/Habit";
import { Home } from "../screens/Home";
import { NewHabit } from "../screens/NewHabit";
import { Profile } from "../screens/Profile";
import { Sign } from "../screens/Sign";

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {

  const { user } = useContext(Context);

  if (!user) {
    return (
      <Navigator screenOptions={{ headerShown: false }}>
        <Screen name="sign" component={Sign} />
      </Navigator>
    );
  }

  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={Home} />
      <Screen name="profile" component={Profile} />
      <Screen name="newHabit" component={NewHabit} />
      <Screen name="habit" component={Habit} />
    </Navigator>
  );
}
