import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Share,
} from "react-native";
import { useLayoutEffect } from "react";
import { HomeStackParamList } from "@Types/navigation";
import { StackScreenProps } from "@react-navigation/stack";
import { verticalScale, horizontalScale, moderateScale } from "@Utils/platform";

type Props = StackScreenProps<HomeStackParamList, "About">;

const AboutScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        fontFamily: "Bukra",
      },
    });
  }, []);
  return (
    <View style={{ flex: 1, paddingVertical: verticalScale(40) }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <Image
          style={{
            width: horizontalScale(100),
            height: verticalScale(100),
            borderRadius: 10,
          }}
          source={require("@Assets/icon.png")}
        />
        <Text
          style={{ fontFamily: "TajawalRegular", fontSize: moderateScale(16) }}
        >
          اصدار 1.0.0
        </Text>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              "https://play.google.com/store/apps/details?id=com.haithamassoli.GPACalculator"
            )
          }
          style={styles.button}
        >
          <Text style={styles.text}>تقييم التطبيق</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Share.share({
              message:
                "https://play.google.com/store/apps/details?id=com.haithamassoli.GPACalculator",
            })
          }
          style={styles.button}
        >
          <Text style={styles.text}>مشاركة التطبيق</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(
              "mailto:haitham.b.assoli@gmail.com?subject=تطبيق حساب المعدل&body=مرحباً هيثم،"
            );
          }}
          style={styles.button}
        >
          <Text style={styles.text}>تواصل مع المطور</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#f1c40f",
    width: horizontalScale(200),
    height: verticalScale(40),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(20),
  },
  text: {
    fontFamily: "TajawalBold",
    fontSize: moderateScale(18),
    color: "#fff",
  },
});
