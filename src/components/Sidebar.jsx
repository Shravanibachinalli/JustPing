import { useState } from "react";

export default function Sidebar({
  activeChat,
  setActiveChat,
  chats,
  theme,
  setTheme,
}) {
  const [search, setSearch] = useState("");

  // Filter users by search text
  const filteredUsers = Object.keys(chats).filter((user) =>
    user.toLowerCase().includes(search.toLowerCase())
  );

  // Dummy avatars (can be replaced)
  const avatars = {
    user1: "https://i.pravatar.cc/150?img=11",
    user2: "https://i.pravatar.cc/150?img=22",
    user3: "https://i.pravatar.cc/150?img=33",
  };

  return (
    <div
      className={`w-64 h-full p-4 flex flex-col justify-between border-r 
      ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : theme === "blue"
          ? "bg-blue-950 text-white"
          : theme === "purple"
          ? "bg-purple-950 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      <div>

        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-4">Chats</h1>

        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 rounded bg-white/20 border mb-4 outline-none"
        />

        {/* USER LIST */}
        <div className="space-y-3">
          {filteredUsers.map((user) => {
            const lastMsg = chats[user][chats[user].length - 1];
            const unreadCount = chats[user].filter((m) => m.sender === "them")
              .length;

            return (
              <div
                key={user}
                onClick={() => setActiveChat(user)}
                className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 
                ${
                  activeChat === user
                    ? "bg-white/30"
                    : "hover:bg-white/20"
                }`}
              >
                {/* AVATAR */}
                <img
                  src={avatars[user]}
                  className="w-10 h-10 rounded-full border"
                />

                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-semibold">{user}</span>

                    {/* ONLINE DOT */}
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  </div>

                  {/* LAST MESSAGE PREVIEW */}
                  <span className="text-xs opacity-70">
                    {lastMsg?.text
                      ? lastMsg.text.slice(0, 20) + "..."
                      : lastMsg?.type === "voice"
                      ? "🎤 Voice message"
                      : "Attachment"}
                  </span>
                </div>

                {/* UNREAD BADGE */}
                {unreadCount > 0 && (
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* THEME SELECTOR */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Themes</h3>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setTheme("light")} className="bg-gray-200 p-2 rounded">Light</button>
          <button onClick={() => setTheme("dark")} className="bg-black text-white p-2 rounded">Dark</button>
          <button onClick={() => setTheme("blue")} className="bg-blue-600 text-white p-2 rounded">Blue</button>
          <button onClick={() => setTheme("pink")} className="bg-pink-500 text-white p-2 rounded">Pink</button>
          <button onClick={() => setTheme("purple")} className="bg-purple-600 text-white p-2 rounded">Purple</button>
          <button onClick={() => setTheme("glass")} className="bg-white/20 backdrop-blur-xl text-white p-2 rounded">Glass</button>
          <button onClick={() => setTheme("whatsapp")} className="bg-green-600 text-white p-2 rounded">WA</button>
          <button onClick={() => setTheme("insta")} className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white p-2 rounded">Insta</button>
        </div>
      </div>
    </div>
  );
}