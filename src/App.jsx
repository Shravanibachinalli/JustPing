import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import ChatWindow from "./components/ChatWindow.jsx";

function App() {
  const [chats, setChats] = useState({
    user1: [
      { sender: "them", text: "Hey! How are you?", time: "10:00 AM" },
      { sender: "me", text: "I'm good! What about you?", time: "10:02 AM" },
    ],
    user2: [
      { sender: "them", text: "Hello 👋", time: "9:00 AM" },
      { sender: "me", text: "Hi! What's up?", time: "9:01 AM" },
    ],
    user3: [
      { sender: "them", text: "Yo! Ready for the project?", time: "7:45 AM" },
    ],
  });

  const [activeChat, setActiveChat] = useState("user1");

  // typing state
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleTyping = () => {
    setIsTyping(true);
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => setIsTyping(false), 1000);
    setTypingTimeout(timeout);
  };

  // SEND (text, voice or file)
  const sendMessage = (msg) => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const finalMessage =
      typeof msg === "string"
        ? { sender: "me", text: msg, time, status: "sent" }
        : { sender: "me", time, status: "sent", ...msg };

    // Add message
    setChats((prev) => ({
      ...prev,
      [activeChat]: [...prev[activeChat], finalMessage],
    }));

    // Delivered →
    setTimeout(() => {
      setChats((prev) => {
        const updated = [...prev[activeChat]];
        updated[updated.length - 1].status = "delivered";
        return { ...prev, [activeChat]: updated };
      });
    }, 1000);

    // Read →
    setTimeout(() => {
      setChats((prev) => {
        const updated = [...prev[activeChat]];
        updated[updated.length - 1].status = "read";
        return { ...prev, [activeChat]: updated };
      });
    }, 2000);
  };

  // DELETE
  const deleteMessage = (index) => {
    setChats((prev) => ({
      ...prev,
      [activeChat]: prev[activeChat].filter((_, i) => i !== index),
    }));
  };

  // THEMES
  const [theme, setTheme] = useState("light");
  const [wallpaper, setWallpaper] = useState(null);

  return (
    <div className="flex h-screen">
      <Sidebar
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        chats={chats}
        theme={theme}
        setTheme={setTheme}
        setWallpaper={setWallpaper}
      />

      <ChatWindow
        user={activeChat.toUpperCase()}
        messages={chats[activeChat]}
        sendMessage={sendMessage}
        isTyping={isTyping}
        handleTyping={handleTyping}
        theme={theme}
        wallpaper={wallpaper}
        deleteMessage={deleteMessage}
      />
    </div>
  );
}

export default App;