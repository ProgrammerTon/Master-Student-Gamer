import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  RefreshControl,
} from "react-native";
import AddNoteQuizWindow from "../ArchiveSystem/AddNoteQuizWindow.jsx";
import ArchiveSearchBar from "../../components/ArchiveSearchBar.jsx";
import ToggleNoteQuiz from "../../components/ToggleNoteQuiz.jsx";
import SourceCard from "../../components/E1_SourceCard.jsx";
import QuizCard from "../../components/F1_QuizCard.jsx";
import Feather from "@expo/vector-icons/Feather";
import { getFavoriteSource, getSource } from "../../services/SourceService";
import { getFavoriteQuiz, getQuiz } from "../../services/QuizService";
import { useGlobalContext } from "../../context/GlobalProvider.js";
import { ActivityIndicator } from "react-native";
import { router, useFocusEffect } from "expo-router";
import SafeAreaViewAndroid from "../../components/SafeAreaViewAndroid.jsx";
import colors from "../../constants/color.js";
import { FontAwesome } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");

const ArchiveMainPage = () => {
  const [ActiveFilter, setActiveFilter] = useState("Latest");
  const [AddWindowVisible, setAddWindowVisible] = useState(false);
  const [filterDirection, setFilterDirection] = useState("↓");
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(1);
  const [refreshing, setRefreshing] = useState(true);
  const [searchField, setSearchField] = useState("");
  const [isSearchNote, setIsSearchNote] = useState(true);
  const { user, isLogged } = useGlobalContext();

  const handleToggleSearch = async (e) => {
    if (e && !isSearchNote) {
      setRefreshing(true);
      setIsSearchNote(e);
      setData([]);
      fetchToggle(1, true); // Fetch first page of notes
      setRefreshing(false);
    }
    if (!e && isSearchNote) {
      setRefreshing(true);
      setIsSearchNote(e);
      setData([]);
      fetchToggle(1, true); // Fetch first page of quizzes
      setRefreshing(false);
    }
    toggleOption();
  };

  const fetchToggle = async (of = offset, reset = false, isSearch = false) => {
    try {
      const sortOrder = filterDirection === "↓" ? "desc" : "asc";
      if (searchField.trim() !== "") {
        isSearch = true;
      }
      const { title, tags } = extractTitleAndTags(searchField);
  
      if (!isSearchNote) {
        const sources = await getSource(of, sortOrder, title, tags, ActiveFilter);
        if (sources && sources?.length !== 0) {
          setData(reset ? sources : [...data, ...sources]);
          setOffset(of + 1);
        }
      } else {
        const quizs = await getQuiz(of, sortOrder, title, tags, ActiveFilter);
        if (quizs?.length !== 0) {
          setData(reset ? quizs : [...data, ...quizs]);
          setOffset(of + 1);
        }
      }
    } catch (error) {
      console.error("Error fetching toggle data:", error); // Handle the error appropriately
    }
  };
  

  const fetchData = async (of = offset, reset = false, isSearch = false) => {
    try {
      if (!refreshing) {
        const sortOrder = filterDirection === "↓" ? "desc" : "asc";
        if (searchField.trim() !== "") {
          isSearch = true;
        }
        const { title, tags } = extractTitleAndTags(searchField);
  
        if (isSearchNote) {
          if (ActiveFilter === "Favorite") {
            const fav_sources = await getFavoriteSource(user._id);
            setData(fav_sources.favorite_sources.reverse());
          } else {
            const sources = await getSource(of, sortOrder, title, tags, ActiveFilter);
            if (sources && sources?.length !== 0) {
              setData(reset ? sources : [...data, ...sources]);
              setOffset(of + 1);
            }
          }
        } else {
          if (ActiveFilter === "Favorite") {
            //console.log("Quiz Favorite");
            const fav_quizzes = await getFavoriteQuiz(user._id);
            console.log("",fav_quizzes.favorite_quizzes);
            setData(fav_quizzes.favorite_quizzes.reverse());
          } else {
            const quizs = await getQuiz(of, sortOrder, title, tags, ActiveFilter);
            console.log("",quizs);
            if (quizs?.length !== 0) {
              setData(reset ? quizs : [...data, ...quizs]);
              setOffset(of + 1);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error); // Handle the error appropriately
    }
  };
  

  const extractTitleAndTags = (input) => {
    const parts = input.split(" "); // Split by " +"
    const tags = parts.map((word) => {
      if (word.startsWith("+")) {
        return word;
      }
      return null;
    });
    let title;
    if (parts[0].startsWith("+")) {
      title = null;
    } else {
      title = parts[0];
    }
    return { title, tags };
  };

  // Handle refresh to reset offset and refetch data
  const handleRefresh = async () => {
    setRefreshing(true);
    setOffset(1); // Reset offset
    setData([]);
    await fetchData(1, true); // Fetch first page of data
    //await fetchToggle(1, true);
    setRefreshing(false);
  };

  // Trigger data fetch when filterDirection changes
  useEffect(() => {
    handleRefresh(); // Refresh data when filter changes
  }, [filterDirection]);

  const toggleOption = async () => {
    setIsSearchNote(!isSearchNote);
    setOffset(1);
    setData([]);
  };

  const ToggleFilterChange = (filter) => {
    if (ActiveFilter === filter) {
      setFilterDirection((prevDirection) =>
        prevDirection === "↓" ? "↑" : "↓"
      );
    } else {
      setActiveFilter(filter);
      setFilterDirection(filter === "Latest" ? "↓" : "↑");
    }
  };

  const optionText = isSearchNote ? "Note" : "Quiz";

  const filterText =
    ActiveFilter === "Latest"
      ? `Latest ${filterDirection}`
      : `Oldest ${filterDirection}`;

  const openAddWindow = () => {
    setAddWindowVisible(true);
  };

  const closeAddWindow = () => {
    setAddWindowVisible(false);
  };

  const handleSubmitSearch = () => {
    setRefreshing(true);
    setData([]);
    fetchData(1, true);
    setRefreshing(false);
  };

  return (
    <SafeAreaViewAndroid style={styles.container}>
      <View style={styles.headerContainer}>
        <ArchiveSearchBar
          value={searchField}
          handleChangeText={(e) => setSearchField(e)}
          onSubmit={handleSubmitSearch}
        />
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={isSearchNote ? styles.searchNote : styles.searchQuiz}
          onPress={(e) => handleToggleSearch(e)}
        >
          <Text style={styles.optionText}>{optionText}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            ActiveFilter === "Favorite"
              ? styles.filterButton
              : styles.inactiveFilterButton
          }
          onPress={() => ToggleFilterChange("Favorite")}
        >
          <Text style={styles.filterText}>Favorite</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            ActiveFilter === "Rating"
              ? styles.filterButton
              : styles.inactiveFilterButton
          }
          onPress={() => ToggleFilterChange("Rating")}
        >
          <Text style={styles.filterText}>Rating</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            ActiveFilter === "Latest" || ActiveFilter === "Oldest"
              ? styles.filterButton
              : styles.inactiveFilterButton
          }
          onPress={() =>
            ToggleFilterChange(ActiveFilter === "Latest" ? "Oldest" : "Latest")
          }
        >
          <Text style={styles.filterText}>{filterText}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.floatingButton} onPress={openAddWindow}>
        <FontAwesome name="plus" size={28} color={colors.white} />
      </TouchableOpacity>
      <AddNoteQuizWindow visible={AddWindowVisible} onClose={closeAddWindow} />
      <FlatList
        data={data}
        renderItem={({ item }) => {
          if (isSearchNote) {
            const fav = user?.favorite_sources?.includes(item?._id)
              ? true
              : false;
            const datenow = new Date();
            const createdAt = new Date(item?.createdAt);
            const diffTime = Math.abs(datenow - createdAt);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const result = diffDays < 1 ? 1 : diffDays;
            return (
              <SourceCard
                id={item?._id}
                title={item?.title}
                author={item?.ownerId?.username}
                tags={item?.tags}
                rating={item?.avg_rating_score}
                isFavorite={fav}
                date={result}
              />
            );
          } else {
            const fav = user?.favorite_quizzes?.includes(item?._id)
              ? true
              : false;
            const datenow = new Date();
            const createdAt = new Date(item?.createdAt);
            const diffTime = Math.abs(datenow - createdAt);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const result = diffDays < 1 ? 1 : diffDays;
            return (
              <QuizCard
                id={item?._id}
                title={item?.title}
                author={item?.ownerId?.username}
                tags={item?.tags}
                rating={item?.avg_rating_score}
                isFavorite={fav}
                date={result}
              />
            );
          }
        }}
        keyExtractor={(item, ind) => `${item._id}-${ind}`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 110 }}
        onEndReached={() => fetchData()} // Load more data when the list reaches the end
        onEndReachedThreshold={0.1} // Adjust as needed
      />
      <View className="my-5"></View>
      {/* <QuizCard /> */}
      <View style={styles.emptyContainer}>
        {/* Waiting For System Traversal Tab*/}
      </View>
    </SafeAreaViewAndroid>
  );
};

export default ArchiveMainPage;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: colors.gray_bg,
    padding: 20,
    paddingTop: 30,
    // alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  searchNote: {
    backgroundColor: colors.yellow,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    width: "22%",
    alignItems: "center",
  },
  searchQuiz: {
    backgroundColor: colors.green,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    width: "22%",
    alignItems: "center",
  },
  filterButton: {
    backgroundColor: colors.blue,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    width: "22%",
    alignItems: "center",
  },
  inactiveFilterButton: {
    backgroundColor: colors.gray_button,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    width: "22%",
    alignItems: "center",
  },
  optionText: {
    color: colors.black,
    fontWeight: "bold",
    fontSize: 12,
  },
  filterText: {
    color: colors.white,
    fontSize: 12,
  },
  listContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatList: {
    width: "100%",
  },
  emptyContainer: {
    flex: 1,
  },
  floatingButton: {
    backgroundColor: colors.red,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: height * 0.15,
    right: width * 0.08,
    shadowColor: colors.gray_bgblur,
    shadowOffset: [{ width: 0, height: 0 }],
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  toggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButtonText: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "bold",
  },
});
