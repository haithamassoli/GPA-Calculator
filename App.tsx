import { useContext, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { I18nManager, Platform, Text, UIManager } from "react-native";
import { reloadAsync } from "expo-updates";
import { ThemeProvider, ThemeContext } from "@Store/themeContext";
import { useFonts } from "expo-font";
import Colors from "@GlobalStyle/colors";
import Route from "@Navigation/main";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function App() {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const forceRTL = async () => {
      if (!I18nManager.isRTL) {
        try {
          I18nManager.allowRTL(true);
          I18nManager.forceRTL(true);
          await reloadAsync();
        } catch (error) {
          console.log(error);
        }
      }
    };
    forceRTL();
    // @ts-ignore
    if (Text.defaultProps == null) {
      // @ts-ignore
      Text.defaultProps = {};
      // @ts-ignore
      Text.defaultProps.allowFontScaling = false;
    }
  }, []);

  const [loaded] = useFonts({
    TajawalRegular: require("./assets/fonts/Tajawal-Regular.ttf"),
    TajawalBold: require("./assets/fonts/Tajawal-Bold.ttf"),
    Bukra: require("./assets/fonts/29ltbukra.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <StatusBar
        style={theme === "light" ? "dark" : "light"}
        backgroundColor={
          theme === "light" ? Colors.lightBackground : Colors.darkBackground
        }
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Route />
      </SafeAreaView>
    </ThemeProvider>
  );
}
