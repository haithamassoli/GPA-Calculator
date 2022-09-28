import { View, Text, LayoutAnimation, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { horizontalScale, moderateScale, verticalScale } from "@Utils/platform";
import Colors from "@GlobalStyle/colors";
import { ThemeContext } from "@Store/themeContext";

type Props = {
  isToggled: boolean;
  setIsToggled: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
};

const Toggle = ({ isToggled, setIsToggled, title }: Props) => {
  const { theme } = useContext(ThemeContext);
  const textColor = theme === "light" ? Colors.lightText : Colors.darkText;
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginVertical: verticalScale(10),
      }}
    >
      <Text
        style={{
          fontFamily: "TajawalBold",
          color: textColor,
          fontSize: moderateScale(16),
        }}
      >
        {title}
      </Text>
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setIsToggled((e) => !e);
        }}
        style={{
          width: horizontalScale(50),
          height: verticalScale(30),
          borderRadius: moderateScale(15),
          backgroundColor:
            isToggled && theme === "light"
              ? Colors.primaryLight
              : isToggled && theme === "dark"
              ? Colors.darkBackgroundSec
              : theme === "light"
              ? Colors.lightGray
              : Colors.darkBackgroundSec,
          justifyContent: "center",
          alignItems: isToggled ? "flex-end" : "flex-start",
        }}
      >
        <View
          style={{
            width: horizontalScale(30),
            height: verticalScale(30),
            borderRadius: moderateScale(15),
            backgroundColor: isToggled ? Colors.primary500 : Colors.gray,
          }}
        ></View>
      </TouchableOpacity>
    </View>
  );
};

export default Toggle;
