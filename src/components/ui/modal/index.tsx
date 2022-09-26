import Colors from "@GlobalStyle/colors";
import { ThemeContext } from "@Store/themeContext";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { horizontalScale, moderateScale, verticalScale } from "@Utils/platform";

type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
};

const CustomModal = ({ visible, setVisible, title }: Props) => {
  const { theme } = useContext(ThemeContext);
  const textColor = theme === "light" ? Colors.lightText : Colors.darkText;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            backgroundColor:
              theme === "light"
                ? Colors.lightBackgroundSec
                : Colors.darkBackgroundSec,
            width: "80%",
            height: verticalScale(200),
            borderRadius: moderateScale(10),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Bukra",
              fontSize: moderateScale(18),
              textAlign: "center",
              marginHorizontal: horizontalScale(20),
              color: textColor,
              lineHeight: verticalScale(30),
            }}
          >
            {title}
          </Text>
          <TouchableOpacity
            onPress={() => setVisible(false)}
            style={{
              backgroundColor: Colors.primary400,
              width: "50%",
              height: verticalScale(40),
              borderRadius: moderateScale(10),
              justifyContent: "center",
              alignItems: "center",
              marginTop: verticalScale(20),
            }}
          >
            <Text
              style={{
                fontFamily: "Bukra",
                fontSize: moderateScale(18),
                color: "white",
              }}
            >
              حسنا
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
