import { View, Text } from "react-native";
import { ThemeContext } from "@Store/themeContext";
import { useContext, useState, useEffect } from "react";
import Colors from "@GlobalStyle/colors";
import { horizontalScale, moderateScale, verticalScale } from "@Utils/platform";
import { screenWidth } from "@Utils/helper";

type Props = {
  title: string;
  rate: string;
  gradeSystem: string;
};

const CardRate = ({ title, rate, gradeSystem }: Props) => {
  const [grade, setGrade] = useState("");
  const { theme } = useContext(ThemeContext);
  const textColor = theme === "light" ? Colors.lightText : Colors.darkText;

  useEffect(() => {
    if (gradeSystem === "symbols") {
      if (+rate >= 4) {
        setGrade("متميز");
      } else if (+rate >= 3.5) {
        setGrade("ممتاز");
      } else if (+rate >= 3) {
        setGrade("جيد جدا");
      } else if (+rate >= 2.5) {
        setGrade("جيد");
      } else if (+rate >= 2) {
        setGrade("مقبول");
      } else if (+rate >= 1.5) {
        setGrade("انذار");
      } else if (+rate === 0) {
        setGrade("لا يوجد بيانات");
      } else {
        setGrade("راسب");
      }
    } else {
      if (+rate >= 85) {
        setGrade("متميز");
      } else if (+rate >= 77) {
        setGrade("ممتاز");
      } else if (+rate >= 70) {
        setGrade("جيد جدا");
      } else if (+rate >= 63) {
        setGrade("جيد");
      } else if (+rate >= 57) {
        setGrade("مقبول");
      } else if (+rate >= 50) {
        setGrade("انذار");
      } else if (+rate === 0) {
        setGrade("لا يوجد بيانات");
      } else {
        setGrade("راسب");
      }
    }
  }, [rate]);

  return (
    <View
      style={{
        backgroundColor:
          theme === "light"
            ? Colors.lightBackgroundSec
            : Colors.darkBackgroundSec,
        borderRadius: moderateScale(20),
        paddingVertical: verticalScale(20),
        paddingHorizontal: horizontalScale(10),
        justifyContent: "center",
        alignItems: "center",
        width: screenWidth / 2 - horizontalScale(20),
      }}
    >
      <Text
        style={{
          fontFamily: "Bukra",
          color: textColor,
          fontSize: moderateScale(16),
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          marginTop: verticalScale(12),
          fontFamily: "TajawalBold",
          color: textColor,
          fontSize: moderateScale(46),
        }}
      >
        {rate}
      </Text>
      <Text
        style={{
          fontFamily: "TajawalBold",
          color: textColor,
          fontSize: moderateScale(24),
        }}
      >
        {grade}
      </Text>
    </View>
  );
};

export default CardRate;
