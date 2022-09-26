import { FC, ReactElement, useRef, useState, useContext } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
  StyleProp,
  ViewStyle,
  LayoutAnimation,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@GlobalStyle/Colors";
import { ThemeContext } from "@Src/store/themeContext";
import { screenHeight } from "@Utils/Helper";
import { horizontalScale, moderateScale, verticalScale } from "@Utils/Platform";

interface Props {
  label: string;
  data: Array<{ label: string; value: string }>;
  onSelect: (item: { label: string; value: string }) => void;
  style: StyleProp<ViewStyle>;
  itemNumber: number;
  lastItem: number;
}

const Dropdown: FC<Props> = ({ label, data, onSelect, itemNumber, style }) => {
  const DropdownButton = useRef();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(undefined);
  const [dropdownBottom, setDropdownBottom] = useState(0);
  const { theme } = useContext(ThemeContext);
  const textColor = theme === "light" ? Colors.lightText : Colors.darkText;

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = (): void => {
    // @ts-ignore
    DropdownButton.current.measure(
      (
        _fx: number,
        _fy: number,
        _w: number,
        h: number,
        _px: number,
        py: number
      ) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setDropdownBottom(screenHeight - py - 4 * h);
      }
    );
    setVisible(true);
  };

  const onItemPress = (item: any): void => {
    setSelected(item);
    // @ts-ignore
    onSelect((prev) => {
      const newState = [...prev];
      newState[itemNumber] = item;
      return newState;
    });
    setVisible(false);
  };

  const renderItem = ({ item }: any): ReactElement<any, any> => (
    <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
      <Text style={{ color: textColor }}>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = (): ReactElement<any, any> => {
    return (
      <Modal visible={visible} transparent animationType="none">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View
            style={[
              styles.dropdown,
              {
                bottom:
                  dropdownBottom < 0
                    ? dropdownBottom + 200
                    : dropdownBottom - 18,
                backgroundColor:
                  theme === "light" && visible
                    ? "#eee"
                    : theme === "dark" && visible
                    ? "#444"
                    : theme === "light"
                    ? Colors.lightBackgroundSec
                    : Colors.darkBackgroundSec,
              },
              style,
            ]}
          >
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <TouchableOpacity
      // @ts-ignore
      ref={DropdownButton}
      style={[
        styles.button,
        {
          backgroundColor:
            theme === "light"
              ? Colors.lightBackgroundSec
              : Colors.darkBackgroundSec,
        },
      ]}
      onPress={toggleDropdown}
    >
      {visible && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: moderateScale(20),
            backgroundColor:
              theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
          }}
        />
      )}
      {renderDropdown()}
      <Text style={[styles.buttonText, { color: textColor }]}>
        {/* @ts-ignore */}
        {(!!selected && selected.label) || label}
      </Text>
      <Feather name="chevron-down" size={moderateScale(24)} color={textColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(8),
    zIndex: 1,
  },
  buttonText: {
    flex: 1,
    textAlign: "center",
  },
  icon: {
    marginRight: horizontalScale(10),
  },
  dropdown: {
    position: "absolute",
    width: horizontalScale(100),
    height: verticalScale(160),
    borderRadius: moderateScale(20),
    shadowColor: "#000000",
    shadowRadius: 4,
    shadowOffset: { height: verticalScale(4), width: 0 },
    shadowOpacity: 0.5,
  },
  overlay: {
    width: "100%",
    height: "100%",
  },
  item: {
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(10),
  },
});

export default Dropdown;
