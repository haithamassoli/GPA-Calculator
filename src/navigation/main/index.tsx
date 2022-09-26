import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeContext } from "@Store/themeContext";
import { useContext } from "react";
import Colors from "@GlobalStyle/colors";
import {
  DarkNavigationColors,
  LightNavigationColors,
} from "@GlobalStyle/navigation";

const Stack = createStackNavigator();

export default function Route() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const iconColor = theme === "light" ? Colors.primary700 : Colors.primary400;
  return (
    <NavigationContainer
      theme={theme === "light" ? LightNavigationColors : DarkNavigationColors}
    >
      <Stack.Navigator initialRouteName="Home">
        {/* <Stack.Screen
        options={{ headerTitle: "عن الجامعة" }}
        name="AboutEECommitte"
        component={AboutEEcommitteScreen}
      /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
