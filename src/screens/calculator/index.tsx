import CustomModal from "@Components/ui/modal";
import { Feather } from "@expo/vector-icons";
import Colors from "@GlobalStyle/colors";
import { StackScreenProps } from "@react-navigation/stack";
import { ThemeContext } from "@Store/themeContext";
import { HomeStackParamList } from "@Types/navigation";
import { screenWidth } from "@Utils/helper";
import DropDownPicker from "react-native-dropdown-picker";
import { horizontalScale, moderateScale, verticalScale } from "@Utils/platform";
import {
  useContext,
  useLayoutEffect,
  useState,
  useRef,
  useEffect,
} from "react";
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
import Toggle from "./toggle";

type Props = StackScreenProps<HomeStackParamList, "Home">;

const CalculatorScreen = ({ navigation }: Props) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const textColor = theme === "light" ? Colors.lightText : Colors.darkText;
  const iconColor = Colors.primary400;
  const scrollViewRef = useRef(null);
  const [cumulative, setCumulative] = useState(true);
  const [visible, setVisible] = useState(false);
  const [massage, setMassage] = useState("");
  const [open, setOpen] = useState(false);
  const [gradeSystem, setGradeSystem] = useState("symbols");
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
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{
              height: verticalScale(40),
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
            onPress={() => toggleTheme()}
          >
            <Feather
              name={theme === "light" ? "moon" : "sun"}
              size={moderateScale(28)}
              color={iconColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: verticalScale(40),
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
            onPress={() => navigation.push("About")}
          >
            <Feather
              name="info"
              style={{
                paddingHorizontal: horizontalScale(8),
              }}
              size={moderateScale(28)}
              color={iconColor}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [theme]);

  useEffect(() => {
    setSubjectCount(1);
    setSelectedHour([{ label: "3", value: 3 }]);
    if (gradeSystem === "symbols") {
      setSelectedGrade([{ label: "A+", value: 4.2 }]);
    } else {
      setSelectedGrade([{ label: "100", value: 100 }]);
    }
  }, [gradeSystem]);

  const addSubject = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (subjectCount >= 15) {
      setMassage("لا يمكن اضافة المزيد من المواد");
      setVisible(true);
    } else {
      if (gradeSystem === "symbols") {
        setSelectedGrade((prev) => [...prev, { label: "A+", value: 4.2 }]);
      } else {
        setSelectedGrade((prev) => [...prev, { label: "100", value: 100 }]);
      }
      setSubjectCount((e) => e + 1);
      setSelectedHour((e) => [...e, { label: "3", value: 3 }]);
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
    if (totalHour === 0) {
      setMassage("لا يمكن ان يكون الساعات 0");
      setVisible(true);
      return;
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
      } else if (+prevGPA > 4.2 && gradeSystem === "symbols") {
        setMassage("المعدل التراكمي السابق لا يمكن أن يتعدى 4.2!");
        setVisible(true);
      } else if (+prevGPA > 100 && gradeSystem === "numbers") {
        setMassage("المعدل التراكمي السابق لا يمكن أن يتعدى 100!");
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
    <View
      style={{
        flex: 1,
        marginHorizontal: horizontalScale(14),
        marginBottom: verticalScale(12),
      }}
    >
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
        <Toggle
          title="حساب المعدل التراكمي"
          isToggled={cumulative}
          setIsToggled={setCumulative}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginVertical: verticalScale(10),
            paddingBottom: verticalScale(10),
          }}
        >
          <Text
            style={{
              fontFamily: "TajawalBold",
              color: textColor,
              fontSize: moderateScale(16),
            }}
          >
            نظام العلامات
          </Text>
          <View
            style={{
              width: horizontalScale(100),
            }}
          >
            <DropDownPicker
              items={[
                { label: "رموز", value: "symbols" },
                { label: "أرقام", value: "numbers" },
              ]}
              containerStyle={{
                height: verticalScale(40),
                width: horizontalScale(100),
              }}
              style={{
                borderWidth: 0,
                backgroundColor:
                  theme === "light"
                    ? Colors.lightBackgroundSec
                    : Colors.darkBackgroundSec,
                borderRadius: moderateScale(20),
              }}
              textStyle={{
                fontFamily: "TajawalBold",
                color: textColor,
                fontSize: moderateScale(16),
                zIndex: 100,
              }}
              dropDownContainerStyle={{
                backgroundColor:
                  theme === "light" && open
                    ? "#eee"
                    : theme === "dark" && open
                    ? "#444"
                    : theme === "light"
                    ? Colors.lightBackgroundSec
                    : Colors.darkBackgroundSec,
                borderWidth: 0,
                borderRadius: moderateScale(20),
              }}
              open={open}
              placeholder="رموز"
              value={gradeSystem}
              setOpen={setOpen}
              setValue={setGradeSystem}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: cumulative ? "space-between" : "center",
            alignItems: "center",
          }}
        >
          <CardRate
            title="المعدل الفصلي"
            rate={semester}
            gradeSystem={gradeSystem}
          />
          {cumulative && (
            <CardRate
              title="المعدل التراكمي"
              rate={GPA}
              gradeSystem={gradeSystem}
            />
          )}
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
                    fontFamily: "TajawalRegular",
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
                fontSize: moderateScale(14),
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
            gradeSystem={gradeSystem}
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
          حساب المعدل
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
