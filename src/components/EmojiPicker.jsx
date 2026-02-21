import { useState, useEffect } from "react";

const allEmojis = [
  "😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😌","😍","😘","😗","😙","😚",
  "😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🥳","😤","😡","😠","🤬","😱","😨","😰",
  "😢","😭","😥","😓","😪","🤤","😴","🤢","🤮","🤧","🥵","🥶","😷","🤒","🤕","🤑",
  "❤️","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖",
  "👍","👎","👏","🙌","🤝","🙏","💪","👀","🔥","✨","⚡","⭐","🌟"
];

export default function EmojiPicker({ onSelect }) {
  const [search, setSearch] = useState("");
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentEmojis") || "[]");
    setRecent(saved);
  }, []);

  const handleSelect = (emoji) => {
    const updated = [emoji, ...recent.filter((e) => e !== emoji)].slice(0, 10);
    setRecent(updated);
    localStorage.setItem("recentEmojis", JSON.stringify(updated));
    onSelect(emoji);
  };

  const filtered = allEmojis.filter((e) =>
    e.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="absolute bottom-20 left-4 bg-white text-black shadow-xl rounded-xl p-3 w-64 z-50 animate-slide-up">

      <input
        className="w-full p-2 rounded border mb-2 text-sm"
        placeholder="Search emoji..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {recent.length > 0 && (
        <>
          <p className="font-semibold text-xs mb-1">Recently used</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {recent.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleSelect(emoji)}
                className="text-xl hover:scale-125 transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
        {filtered.map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleSelect(emoji)}
            className="text-xl hover:scale-125 transition"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}