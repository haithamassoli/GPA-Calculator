import CustomModal from "@Components/ui/modal";
import Colors from "@GlobalStyle/colors";
import { StackScreenProps } from "@react-navigation/stack";
import { ThemeContext } from "@Store/themeContext";
import { HomeStackParamList } from "@Types/navigation";
import { screenWidth } from "@Utils/helper";
import { horizontalScale, moderateScale, verticalScale } from "@Utils/platform";
import { useContext, useLayoutEffect, useState, useRef } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
} from "react-native";
import CardRate from "./cardRate";
import SubjectRate from "./subjectRate";

type Props = StackScreenProps<HomeStackParamList, "Calculator">;

const CalculatorScreen = ({ navigation }: Props) => {
  const { theme } = useContext(ThemeContext);
  const textColor = theme === "light" ? Colors.lightText : Colors.darkText;
  // const iconColor =
  //   theme === "light"
  //     ? require("@Assets/images/icons/light-icons/calculator.png")
  //     : require("@Assets/images/icons/dark-icons/calculator.png");

  const scrollViewRef = useRef();
  const [cumulative, setCumulative] = useState(true);
  const [visible, setVisible] = useState(false);
  const [massage, setMassage] = useState("");
  const [semester, setSemester] = useState("0");
  const [GPA, setGPA] = useState("0");
  const [prevGPA, setPrevGPA] = useState("0");
  const [prevSemesterHour, setPrevSemesterHour] = useState("0");
  const [selectedHour, setSelectedHour] = useState([{ label: "3", value: 3 }]);
  const [selectedGrade, setSelectedGrade] = useState([
    { label: "A+", value: 4.2 },
  ]);
  const [subjectCount, setSubjectCount] = useState(1);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "حساب المعدل",
      headerTitleStyle: {
        fontFamily: "Bukra",
      },
      // headerLeft: () => (
      //   <CustomHeader
      //     onPress={() => navigation.goBack()}
      //     iconColor={iconColor}
      //   />
      // ),
    });
  }, []);

  const addSubject = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (subjectCount >= 8) {
      setMassage("لا يمكن اضافة المزيد من المواد");
      setVisible(true);
    } else {
      setSubjectCount((e) => e + 1);
      setSelectedHour((e) => [...e, { label: "3", value: 3 }]);
      setSelectedGrade((e) => [...e, { label: "A+", value: 4.2 }]);
    }
  };

  const deleteSubject = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (subjectCount === 1) {
      setMassage("لا يمكن حذف كل المواد!");
      setVisible(true);
      return;
    }
    setSubjectCount((e) => e - 1);
    setSelectedHour((e) => e.slice(0, -1));
    setSelectedGrade((e) => e.slice(0, -1));
  };

  const calculateRate = () => {
    let totalHour = 0;
    let totalGrade = 0;
    for (let i = 0; i < subjectCount; i++) {
      totalHour += selectedHour[i].value;
      totalGrade += selectedGrade[i].value * selectedHour[i].value;
    }
    setSemester((+totalGrade / +totalHour).toFixed(2));
    if (cumulative) {
      // @ts-ignore
      if (isNaN(prevGPA)) {
        setMassage("يجب إدخال المعدل التراكمي السابق!");
        setVisible(true);
        // @ts-ignore
      } else if (isNaN(prevSemesterHour)) {
        setMassage("يجب إدخال عدد الساعات المقطوعة!");
        setVisible(true);
      } else if (+prevSemesterHour + totalHour > 160) {
        setMassage("عدد الساعات المقطوعة لا يمكن أن يتعدى 160 ساعة!");
        setVisible(true);
      } else if (+prevGPA > 4.2) {
        setMassage("المعدل التراكمي السابق لا يمكن أن يتعدى 4.2!");
        setVisible(true);
      } else {
        setGPA(
          (
            (+prevGPA * +prevSemesterHour + totalGrade) /
            (+prevSemesterHour + totalHour)
          ).toFixed(2)
        );
      }
    }
  };

  return (
    <View style={{ flex: 1, marginHorizontal: horizontalScale(14) }}>
      <CustomModal visible={visible} title={massage} setVisible={setVisible} />
      <ScrollView
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        // @ts-ignore
        ref={scrollViewRef}
        onContentSizeChange={() =>
          // @ts-ignore
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
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
            حساب المعدل التراكمي
          </Text>
          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut
              );
              setCumulative((e) => !e);
            }}
            style={{
              width: horizontalScale(50),
              height: verticalScale(30),
              borderRadius: moderateScale(15),
              backgroundColor:
                cumulative && theme === "light"
                  ? Colors.primaryLight
                  : cumulative && theme === "dark"
                  ? Colors.darkBackgroundSec
                  : theme === "light"
                  ? Colors.lightGray
                  : Colors.darkBackgroundSec,
              justifyContent: "center",
              alignItems: cumulative ? "flex-end" : "flex-start",
            }}
          >
            <View
              style={{
                width: horizontalScale(30),
                height: verticalScale(30),
                borderRadius: moderateScale(15),
                backgroundColor: cumulative ? Colors.primary500 : Colors.gray,
              }}
            ></View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: cumulative ? "space-between" : "center",
            alignItems: "center",
          }}
        >
          <CardRate title="المعدل الفصلي" rate={semester} />
          {cumulative && <CardRate title="المعدل التراكمي" rate={GPA} />}
        </View>
        {cumulative && (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: verticalScale(20),
              }}
            >
              <Text
                style={{
                  fontFamily: "Bukra",
                  color: textColor,
                  fontSize: moderateScale(16),
                  width: horizontalScale(200),
                }}
              >
                المعدل التراكمي السابق
              </Text>
              <TextInput
                style={{
                  fontFamily: "TajawalBold",
                  color: textColor,
                  fontSize: moderateScale(18),
                  width: horizontalScale(72),
                  textAlign: "center",
                  borderRadius: moderateScale(10),
                  backgroundColor:
                    theme === "light"
                      ? Colors.lightBackgroundSec
                      : Colors.darkBackgroundSec,
                  paddingVertical: verticalScale(4),
                  paddingHorizontal: horizontalScale(8),
                  marginLeft: horizontalScale(14),
                }}
                keyboardType="numeric"
                value={prevGPA}
                onChangeText={(e) => setPrevGPA(e)}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
                marginTop: verticalScale(20),
              }}
            >
              <View>
                <Text
                  style={{
                    fontFamily: "Bukra",
                    color: textColor,
                    fontSize: moderateScale(16),
                    width: horizontalScale(200),
                  }}
                >
                  عدد الساعات المقطوعة
                </Text>
                <Text
                  style={{
                    fontFamily: "TajawalMedium",
                    color: textColor,
                    fontSize: moderateScale(12),
                    marginTop: verticalScale(4),
                    width: horizontalScale(150),
                    alignSelf: "flex-start",
                  }}
                >
                  *لا يشمل الساعات التي تم احتسابها ناجح راسب
                </Text>
              </View>
              <TextInput
                style={{
                  fontFamily: "TajawalBold",
                  color: textColor,
                  fontSize: moderateScale(18),
                  width: horizontalScale(72),
                  textAlign: "center",
                  borderRadius: moderateScale(10),
                  backgroundColor:
                    theme === "light"
                      ? Colors.lightBackgroundSec
                      : Colors.darkBackgroundSec,
                  paddingVertical: verticalScale(4),
                  paddingHorizontal: horizontalScale(8),
                  marginLeft: horizontalScale(14),
                }}
                keyboardType="numeric"
                value={prevSemesterHour}
                onChangeText={(e) => setPrevSemesterHour(e)}
              />
            </View>
          </>
        )}
        <Text
          style={{
            fontFamily: "TajawalBold",
            color: textColor,
            textAlign: "center",
            fontSize: moderateScale(28),
            marginTop: verticalScale(20),
          }}
        >
          مواد الفصل الحالي
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: verticalScale(20),
          }}
        >
          <View
            style={{
              backgroundColor:
                theme === "light"
                  ? Colors.lightBackgroundSec
                  : Colors.darkBackgroundSec,
              borderRadius: moderateScale(20),
              paddingVertical: verticalScale(12),
              paddingHorizontal: horizontalScale(8),
              justifyContent: "center",
              alignItems: "center",
              width: (screenWidth - horizontalScale(174)) / 2 - 8,
            }}
          >
            <Text
              style={{
                fontFamily: "Bukra",
                color: textColor,
                fontSize: moderateScale(16),
              }}
            >
              وزن المادة
            </Text>
          </View>
          <View
            style={{
              backgroundColor:
                theme === "light"
                  ? Colors.lightBackgroundSec
                  : Colors.darkBackgroundSec,
              borderRadius: moderateScale(20),
              paddingVertical: verticalScale(12),
              paddingHorizontal: horizontalScale(8),
              justifyContent: "center",
              alignItems: "center",
              width: horizontalScale(174 - 32),
            }}
          >
            <Text
              style={{
                fontFamily: "Bukra",
                color: textColor,
                fontSize: moderateScale(16),
              }}
            >
              اسم المادة
            </Text>
          </View>
          <View
            style={{
              backgroundColor:
                theme === "light"
                  ? Colors.lightBackgroundSec
                  : Colors.darkBackgroundSec,
              borderRadius: moderateScale(20),
              paddingVertical: verticalScale(12),
              paddingHorizontal: horizontalScale(8),
              justifyContent: "center",
              alignItems: "center",
              width: (screenWidth - horizontalScale(174)) / 2 - 8,
            }}
          >
            <Text
              style={{
                fontFamily: "Bukra",
                color: textColor,
                fontSize: moderateScale(16),
              }}
            >
              العلامة
            </Text>
          </View>
        </View>
        {numberToArray(subjectCount).map((_, index) => (
          <SubjectRate
            key={index}
            setSelectedHour={setSelectedHour}
            setSelectedGrade={setSelectedGrade}
            itemNumber={index}
          />
        ))}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: verticalScale(12),
          }}
        >
          <TouchableOpacity
            onPress={addSubject}
            style={{
              backgroundColor: "#ffc107",
              borderRadius: moderateScale(20),
              paddingVertical: verticalScale(12),
              paddingHorizontal: horizontalScale(8),
              justifyContent: "center",
              alignItems: "center",
              width: "48%",
            }}
          >
            <Text
              style={{
                fontFamily: "Bukra",
                color: Colors.lightBackground,
                fontSize: moderateScale(16),
              }}
            >
              إضافة مادة
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={deleteSubject}
            style={{
              backgroundColor: "#CA0B00",
              borderRadius: moderateScale(20),
              paddingVertical: verticalScale(12),
              paddingHorizontal: horizontalScale(8),
              justifyContent: "center",
              alignItems: "center",
              width: "48%",
            }}
          >
            <Text
              style={{
                fontFamily: "Bukra",
                color: Colors.lightBackground,
                fontSize: moderateScale(16),
              }}
            >
              حذف مادة
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={calculateRate}
        style={{
          backgroundColor: "#4BB543",
          borderRadius: moderateScale(20),
          paddingVertical: verticalScale(12),
          paddingHorizontal: horizontalScale(8),
          justifyContent: "center",
          alignItems: "center",
          marginTop: verticalScale(6),
        }}
      >
        <Text
          style={{
            fontFamily: "Bukra",
            color: Colors.lightBackground,
            fontSize: moderateScale(16),
          }}
        >
          احتساب المعدل
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CalculatorScreen;

const numberToArray = (number: number) => {
  const array = [];
  for (let i = 0; i < number; i++) {
    array.push(i);
  }
  return array;
};
