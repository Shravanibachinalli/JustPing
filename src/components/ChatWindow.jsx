import { useState, useRef, useEffect } from "react";
import ChatMessages from "./ChatMessages";
import EmojiPicker from "./EmojiPicker";

export default function ChatWindow({
  user,
  messages,
  sendMessage,
  isTyping,
  handleTyping,
  theme,
  wallpaper,
  deleteMessage,
}) {
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  // VOICE RECORDING STATES
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showCancel, setShowCancel] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // FILE INPUT REF
  const fileInputRef = useRef(null);

  // MARK ALL MESSAGES AS READ WHEN CHAT OPENS
  useEffect(() => {
    messages.forEach((msg) => {
      if (msg.sender === "me" && msg.status !== "read") {
        msg.status = "read";
      }
    });
  }, [messages]);

  /* ------------------- START RECORDING ------------------- */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) =>
        audioChunksRef.current.push(e.data);

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);

    } catch {
      alert("Microphone permission blocked!");
    }
  };

  /* ------------------- STOP RECORDING ------------------- */
  const stopRecording = () => {
    if (!isRecording) return;

    clearInterval(timerRef.current);
    setIsRecording(false);

    // If user slid left to cancel
    if (showCancel) {
      setShowCancel(false);
      return;
    }

    mediaRecorderRef.current.stop();

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);

      sendMessage({
        type: "voice",
        duration: recordingTime,
        audioUrl,
      });
    };
  };

  /* ------------------- CANCEL RECORDING ------------------- */
  const cancelRecording = () => {
    if (!isRecording) return;

    setShowCancel(true);
    clearInterval(timerRef.current);
    setIsRecording(false);

    try {
      mediaRecorderRef.current.stop();
    } catch {}
  };

  /* ------------------- SEND TEXT ------------------- */
  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  /* ------------------- SEND FILE ------------------- */
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);

    sendMessage({
      type: "file",
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(1) + " KB",
      fileUrl,
      fileType: file.type,
    });
  };

  return (
    <div
      className={`flex flex-col flex-1 transition-all duration-300 ${
        theme === "light"
          ? "bg-white text-black"
          : theme === "dark"
          ? "bg-gray-900 text-white"
          : theme === "blue"
          ? "bg-blue-900 text-white"
          : theme === "pink"
          ? "bg-pink-100 text-pink-900"
          : theme === "purple"
          ? "bg-purple-900 text-white"
          : theme === "glass"
          ? "backdrop-blur-xl bg-white/10 text-white"
          : theme === "whatsapp"
          ? "bg-[#ECE5DD]"
          : theme === "insta"
          ? "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white"
          : "bg-white"
      }`}
    >
      {/* HEADER */}
      <div className="p-4 border-b text-lg font-semibold flex items-center gap-2">
        {user}
        <span className="text-green-500 text-sm">online</span>
      </div>

      {/* CHAT MESSAGES */}
      <ChatMessages
        messages={messages}
        theme={theme}
        deleteMessage={deleteMessage}
      />

      {/* EMOJI PICKER */}
      {showEmoji && (
        <EmojiPicker
          onSelect={(emoji) => {
            setInput((prev) => prev + emoji);
            setShowEmoji(false);
          }}
        />
      )}

      {/* RECORDING BANNER */}
      {isRecording && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-red-500 px-6 py-3 text-white rounded-full animate-pulse flex items-center gap-3">
          <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
          Recording… 0:{recordingTime < 10 ? "0" + recordingTime : recordingTime}
        </div>
      )}

      {/* INPUT BAR */}
      <div className="p-4 flex items-center gap-3 border-t relative">

        {/* HIDDEN FILE INPUT */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* EMOJI BUTTON */}
        {!isRecording && (
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="w-10 h-10 flex justify-center items-center bg-gray-300 rounded-full text-black"
          >
            😊
          </button>
        )}

        {/* FILE ATTACH BUTTON */}
        {!isRecording && (
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-10 h-10 flex justify-center items-center bg-gray-300 rounded-full text-black"
          >
            📎
          </button>
        )}

        {/* RECORDING LABEL */}
        {isRecording ? (
          <div className="text-red-600 text-sm animate-bounce">
            Slide left to cancel
          </div>
        ) : (
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleTyping();
            }}
            className="flex-1 px-4 py-2 border rounded-full"
            placeholder="Type a message..."
          />
        )}

        {/* SEND BUTTON */}
        {!isRecording && (
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded-full"
          >
            Send
          </button>
        )}

        {/* MIC BUTTON */}
        <button
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isRecording ? "bg-red-600 scale-125" : "bg-gray-800 text-white"
          }`}
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={cancelRecording}
        >
          🎤
        </button>
      </div>
    </div>
  );
}