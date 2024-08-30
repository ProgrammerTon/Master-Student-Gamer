import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../utils/asyncstroage";
import socket from "../hooks/socket";
import { fetchChat } from "../services/ChatService";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  const joinRoom = (room) => {
    socket.emit("joinRoom", room);
  };

  const leaveRoom = (room) => {
    socket.emit("leaveRoom", room);
  };

  const clearMessage = () => {
    setMessages([]);
  };

  const fetchMessage = async (room, offset) => {
    const chat = await fetchChat(room, offset);
    console.log("Chat", chat);
    setMessages((prevMessages) => [...chat, ...prevMessages]);
  };

  const sendMessage = ({ room, text, sender, type, time }) => {
    socket.emit(
      "newMessage",
      JSON.stringify({ rooms: room, text, sender, type, time })
    );
  };

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLogged(true);
          setUser(res);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });

    const handleNewMessage = async (message) => {
      try {
        console.log(message);
        const newMessage = JSON.parse(message); // Synchronously parse the JSON string
        setMessages((prevMessages) => [...prevMessages, newMessage]); // Add the new message to state
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    };
    socket.on("message", handleNewMessage);

    return () => {
      socket.off("message", handleNewMessage);
    };
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        messages,
        setMessages,
        joinRoom,
        leaveRoom,
        sendMessage,
        fetchMessage,
        clearMessage,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
