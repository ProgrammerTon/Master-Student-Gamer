import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import colors from "../constants/color";
import fonts from "../constants/font";

const ArchiveSearchBar = ({ value, handleChangeText, onSubmit }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={colors.gray_button}
          value={value}
          onSubmitEditing={onSubmit}
          onChangeText={handleChangeText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex : 1,
  },
  searchContainer: {
    width: '100%', 
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: colors.gray_bgblur,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
});

export default ArchiveSearchBar;
