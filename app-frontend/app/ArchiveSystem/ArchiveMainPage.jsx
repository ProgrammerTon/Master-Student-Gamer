import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import AddNoteQuizWindow from './AddNoteQuizWindow.jsx';
import SearchBar from '../../components/SearchBar';
import ToggleNoteQuiz from '../../components/ToggleNoteQuiz.jsx';

const ArchiveMainPage = () => {
  const [ActiveFilter,setActiveFilter] = useState('Relevance');
  const [AddWindowVisible, setAddWindowVisible] = useState(false);
  const [AddToggleNoteQuizVisible, setAddToggleNoteQuizVisible] = useState(false);
  const ToggleFilterChange = (filter) => {
    setActiveFilter(filter); 
  };

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
    <View style={styles.container}>
      {/*
      <TouchableOpacity style={styles.toggleButton}
          onPress={openAddToggleNoteQuizVisible}>
          <Text style={styles.filterText}>T</Text>
        </TouchableOpacity>
        
        <ToggleNoteQuiz visible={AddToggleNoteQuizVisible} onClose={closeAddToggleNoteQuizVisible} />
        */}
      <SearchBar />
      <View style={styles.filterContainer}>
        <TouchableOpacity style={ActiveFilter === 'Relevance' ? styles.filterButton : styles.inactiveFilterButton}
          onPress={() => ToggleFilterChange('Relevance')}>
          <Text style={styles.filterText}>Relevance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={ActiveFilter === 'Rating' ? styles.filterButton : styles.inactiveFilterButton}
          onPress={() => ToggleFilterChange('Rating')}>
          <Text style={styles.filterText}>Rating</Text>
        </TouchableOpacity>
        <TouchableOpacity style={ActiveFilter === 'Latest' ? styles.filterButton : styles.inactiveFilterButton}
          onPress={() => ToggleFilterChange('Latest')}>
          <Text style={styles.filterText}>Latest ↓ ↑</Text>
        </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.circle} onPress={openAddWindow}>
          <Text style={styles.PlusText}>+</Text>
        </TouchableOpacity>
        <AddNoteQuizWindow visible={AddWindowVisible} onClose={closeAddWindow} />
      <View style={styles.emptyContainer}>
        {/* Waiting For System Traversal Tab*/}
      </View>
    </View>
  );
};

export default ArchiveMainPage;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#3367d6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  inactiveFilterButton: {
    backgroundColor: '#cccccc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  filterText: {
    color: '#ffffff',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
  },
  circle: {
    width: 40,       
    height: 40,      
    borderRadius: 20,  
    backgroundColor: '#ef6d11',
    position: 'absolute',  
    bottom: 10,           
    right: 20,          
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ef6d11',
    position: 'absolute',
    top: 10,         // Distance from the top of the screen
    left: 20,        // Distance from the left of the screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  PlusText: {
    color: '#ffffff',
    fontSize: 30,
    textAlign: 'center',  
  },
});

