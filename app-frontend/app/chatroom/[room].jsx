import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import { router, useLocalSearchParams } from "expo-router";
import { fetchChat } from "../../services/ChatService";

const ChatView = ({ message, index, name }) => {
  return (
    <View
      key={index}
      style={[
        styles.messageContainer,
        message.sender === name ? styles.receiverMessage : styles.userMessage,
      ]}
    >
      <Text style={styles.messageText}>{message.text}</Text>
      <Text style={styles.messageTime}>{message.time}</Text>
    </View>
  );
};

const ArchiveMainPage = () => {
  const { room } = useLocalSearchParams();
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [offset, setOffset] = useState(1);
  const [loading, setLoading] = useState(false);
  const {
    joinRoom,
    leaveRoom,
    messages,
    sendMessage,
    fetchMessage,
    user,
    isLogged,
    clearMessage,
  } = useGlobalContext();

  useEffect(() => {
    if (!isLogged || !user) {
      router.replace("/sign-in");
    } else {
      setName(user.username);
    }
    console.log("Join Room", room);
    joinRoom(room);
    fetchChat();
    return () => {
      leaveRoom(room);
      clearMessage();
    };
  }, []);

  const fetchChat = () => {
    setLoading(true);
    fetchMessage(room, offset);
    setOffset(offset + 1);
    setLoading(false);
  };

  const handleSendMessage = () => {
    if (message && room) {
      const time = new Date().toLocaleTimeString().slice(0, 5);
      const type = "Text";
      const sender = name;
      const text = message;
      sendMessage({ room, text, sender, type, time });
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item, index }) => (
          <ChatView index={index} message={item} name={name} />
        )}
        keyExtractor={(item, index) => `${item.sender}-${index}`}
        inverted // This makes the list scroll from bottom to top
        onEndReached={fetchChat}
        onEndReachedThreshold={0.1} // Adjust as needed
        ListFooterComponent={loading && <ActivityIndicator />}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ArchiveMainPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  chatContainer: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: "70%",
    padding: 10,
    borderRadius: 10,
  },
  userMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
  },
  receiverMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#e1ffc7",
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: "#555",
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#007bff",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

{
  /* <ScrollView style={styles.chatContainer}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              message.sender === name
                ? styles.receiverMessage
                : styles.userMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
            <Text style={styles.messageTime}>{message.time}</Text>
          </View>
        ))}
      </ScrollView> */
}
