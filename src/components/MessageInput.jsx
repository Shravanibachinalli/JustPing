import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

export default function MessageInput({ sendMessage, handleTyping }) {
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(text);
    setText("");
    setShowPicker(false);
  };

  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    handleTyping();
  };

  return (
    <div className="relative">
      {/* Emoji Picker Popup */}
      {showPicker && (
        <div className="absolute bottom-16 left-4 z-50 bg-white shadow-lg rounded-lg">
          <EmojiPicker onEmojiClick={onEmojiClick} height={350} width={300} />
        </div>
      )}

      <form onSubmit={handleSend} className="p-4 border-t bg-white flex gap-2">

        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="text-2xl hover:bg-gray-100 px-2 rounded"
        >
          😊
        </button>

        {/* Input field */}
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          className="flex-1 border rounded-lg p-2"
          placeholder="Type a message..."
        />

        {/* Send Button */}
        <button className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700">
          Send
        </button>
      </form>
    </div>
  );
}