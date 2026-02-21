import { useEffect, useRef, useState } from "react";

const reactionOptions = ["❤️", "😂", "😮", "😢", "👍", "👎"];

export default function ChatMessages({ messages, theme, deleteMessage }) {
  const bottomRef = useRef(null);

  const [reactionBarIndex, setReactionBarIndex] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null); // ⭐ NEW: long-press menu

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close menu when clicking outside
  useEffect(() => {
    const close = () => setMenuIndex(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // Copy text
  const copyText = (text) => {
    navigator.clipboard.writeText(text || "");
    alert("Copied!");
  };

  // Forward (just copies message for now)
  const forwardMessage = (msg) => {
    navigator.clipboard.writeText(
      msg.text ||
        msg.fileName ||
        (msg.type === "voice" ? "[Voice message]" : "")
    );
    alert("Copied to forward!");
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">

      {messages.map((msg, index) => (
        <div
          key={index}
          className={`relative group flex ${
            msg.sender === "me" ? "justify-end" : "justify-start"
          }`}
        >
          {/* MESSAGE BUBBLE */}
          <div
            className={`p-3 rounded-xl max-w-xs shadow-md relative transition-all duration-300
              ${
                msg.sender === "me"
                  ? theme === "whatsapp"
                    ? "bg-[#DCF8C6] text-black"
                    : theme === "pink"
                    ? "bg-pink-500 text-white"
                    : theme === "purple"
                    ? "bg-purple-700 text-white"
                    : theme === "blue"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-600 text-white"
                  : theme === "whatsapp"
                  ? "bg-white text-black"
                  : theme === "dark"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-black"
              }
            `}
            onContextMenu={(e) => {
              e.preventDefault();
              setMenuIndex(index);
            }}
            onDoubleClick={() => setReactionBarIndex(index)}
          >
            {/* TEXT MESSAGE */}
            {msg.text && <div>{msg.text}</div>}

            {/* VOICE MESSAGE */}
            {msg.type === "voice" && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center">
                    🎤
                  </div>
                  <div className="text-sm opacity-80">
                    Voice • 0:{msg.duration < 10 ? "0" : ""}
                    {msg.duration}
                  </div>
                </div>
                <audio controls src={msg.audioUrl} className="w-48" />
              </div>
            )}

            {/* FILE MESSAGE */}
            {msg.type === "file" && (
              <div className="mt-2">
                {msg.fileType.startsWith("image/") ? (
                  <img
                    src={msg.fileUrl}
                    className="w-48 rounded-lg shadow-md"
                  />
                ) : (
                  <div className="bg-white text-black p-3 rounded-lg shadow w-48">
                    <div className="font-semibold flex items-center gap-2">
                      📄 {msg.fileName}
                    </div>
                    <div className="text-sm opacity-70">{msg.fileSize}</div>
                    <a
                      href={msg.fileUrl}
                      target="_blank"
                      className="text-blue-600 underline text-sm mt-2 inline-block"
                    >
                      Open
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* REACTION ICON */}
            {msg.reaction && (
              <div className="absolute -bottom-3 right-3 text-xl animate-pop">
                {msg.reaction}
              </div>
            )}

            {/* STATUS TICKS */}
            {msg.sender === "me" && (
              <div className="mt-1 text-xs flex justify-end">
                {msg.status === "sent" && (
                  <span className="opacity-70">✓</span>
                )}
                {msg.status === "delivered" && (
                  <span className="opacity-70">✓✓</span>
                )}
                {msg.status === "read" && (
                  <span className="text-blue-500 font-bold">✓✓</span>
                )}
              </div>
            )}
          </div>

          {/* REACTION BAR */}
          {reactionBarIndex === index && (
            <div className="absolute flex gap-2 bg-white shadow-md p-2 rounded-full -top-10 animate-pop z-50">
              {reactionOptions.map((emoji) => (
                <button
                  key={emoji}
                  className="text-xl hover:scale-125 transition"
                  onClick={() => {
                    msg.reaction = emoji;
                    setReactionBarIndex(null);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* ⭐ LONG PRESS MENU ⭐ */}
          {menuIndex === index && (
            <div className="absolute right-0 bg-white shadow-lg rounded-lg p-2 w-32 z-50 animate-fade-in">

              <button
                onClick={() => {
                  copyText(msg.text);
                  setMenuIndex(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-gray-100"
              >
                📄 Copy
              </button>

              <button
                onClick={() => {
                  forwardMessage(msg);
                  setMenuIndex(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-gray-100"
              >
                📤 Forward
              </button>

              <button
                onClick={() => {
                  deleteMessage(index);
                  setMenuIndex(null);
                }}
                className="w-full text-left px-3 py-1 text-red-600 hover:bg-gray-100"
              >
                🗑 Delete
              </button>

            </div>
          )}

        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}