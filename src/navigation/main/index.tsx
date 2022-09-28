import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeContext } from "@Store/themeContext";
import { useContext } from "react";
import {
  DarkNavigationColors,
  LightNavigationColors,
} from "@GlobalStyle/navigation";
import CalculatorScreen from "@Screens/calculator";
import AboutScreen from "@Screens/about";
import { HomeStackParamList } from "@Types/navigation";

const Stack = createStackNavigator<HomeStackParamList>();

export default function Route() {
  const { theme } = useContext(ThemeContext);
  return (
    <NavigationContainer
      theme={theme === "light" ? LightNavigationColors : DarkNavigationColors}
    >
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          options={{ headerTitle: "الرئيسية" }}
          name="Home"
          component={CalculatorScreen}
        />
        <Stack.Screen
          options={{ headerTitle: "عن التطبيق" }}
          name="About"
          component={AboutScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
