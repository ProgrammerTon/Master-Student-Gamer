import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import AddNoteQuizWindow from "../ArchiveSystem/AddNoteQuizWindow.jsx";
import ArchiveSearchBar from "../../components/ArchiveSearchBar.jsx";
import ToggleNoteQuiz from "../../components/ToggleNoteQuiz.jsx";
import SourceCard from "../../components/E1_SourceCard.jsx";
import QuizCard from "../../components/F1_QuizCard.jsx";
import Feather from "@expo/vector-icons/Feather";
import { getSource } from "../../services/SourceService";
import { useGlobalContext } from "../../context/GlobalProvider.js";
import { ActivityIndicator } from "react-native";
import { router } from "expo-router";
import SafeAreaViewAndroid from "../../components/SafeAreaViewAndroid.jsx";

const ArchiveMainPage = () => {
  const [ActiveFilter, setActiveFilter] = useState("Relevance");
  const [AddWindowVisible, setAddWindowVisible] = useState(false);
  const [AddToggleNoteQuizVisible, setAddToggleNoteQuizVisible] =
    useState(false);
  const [filterDirection, setFilterDirection] = useState("↓");
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(1);
  const [refreshing, setRefreshing] = useState(true);
  const { isLogged } = useGlobalContext();

  const fetchData = async (of = offset, reset = false) => {
    const sortOrder = filterDirection === "↓" ? "desc" : "asc";
    setRefreshing(true);

    const sources = await getSource(of, sortOrder);

    if (sources.length !== 0) {
      setData((prevData) => (reset ? sources : [...prevData, ...sources]));
      setOffset(of + 1); // Increment the offset for pagination
    }

    setRefreshing(false);
  };

  // Handle refresh to reset offset and refetch data
  const handleRefresh = async () => {
    setOffset(1); // Reset offset
    setData([]); // Clear current data
    fetchData(1, true); // Fetch first page of data
  };

  // Trigger data fetch when filterDirection changes
  useEffect(() => {
    handleRefresh(); // Refresh data when filter changes
  }, [filterDirection]);

  // Initial fetch when component loads and handle login redirection
  useEffect(() => {
    if (!isLogged) {
      router.replace("/sign-in");
    } else {
      fetchData(); // Initial data fetch
    }
  }, []);

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

  const openAddToggleNoteQuizVisible = () => {
    setAddToggleNoteQuizVisible(true);
  };

  const closeAddToggleNoteQuizVisible = () => {
    setAddToggleNoteQuizVisible(false);
  };

  return (
    <SafeAreaViewAndroid style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={openAddToggleNoteQuizVisible}
          style={{ marginRight: 10 }}
        >
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
        <ToggleNoteQuiz
          visible={AddToggleNoteQuizVisible}
          onClose={closeAddToggleNoteQuizVisible}
        />
        <ArchiveSearchBar />
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={
            ActiveFilter === "Relevance"
              ? styles.filterButton
              : styles.inactiveFilterButton
          }
          onPress={() => ToggleFilterChange("Relevance")}
        >
          <Text style={styles.filterText}>Relevance</Text>
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
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
      <AddNoteQuizWindow visible={AddWindowVisible} onClose={closeAddWindow} />
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <SourceCard
            id={item._id}
            title={item.title}
            author={item.ownerId.username}
            tags={item.tags}
            rating={item.averageScore}
          />
        )}
        keyExtractor={(item, ind) => `${item._id}-${ind}`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
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
    backgroundColor: "#f8f8f8",
    padding: 20,
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
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: "#3367d6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    width: "28%",
    alignItems: "center",
  },
  inactiveFilterButton: {
    backgroundColor: "#cccccc",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    width: "28%",
    alignItems: "center",
  },
  filterText: {
    color: "#ffffff",
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
  },
  floatingButton: {
    backgroundColor: "#FF6347",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 100,
    right: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1000,
  },
  toggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ef6d11",
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
