"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function FeedPage() {
  // const [liked, setLiked] = useState(Array(8).fill(false));
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  // const [follow, setFollow] = useState(false);

  // Check login token on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);
  }, []);

  // Create Post API
  const handlePost = async () => {
    if (!content.trim()) return alert("Post cannot be empty!");

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (res.ok) {
        // alert("Post created! 🎉");
        toast.success("Post created! 🎉");
        setContent("");
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (err) {
      alert("Server error");
    }

    setLoading(false);
  };

  // follow
  const handleFollow = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    } 
    // else {
    //   setFollow(true);
    // }
  };

  const colors = ["bg-red-600", "bg-green-600", "bg-blue-600", "bg-purple-600"];

  const posts = [
    {
      name: "Neha Kulkarni",
      text: "UI/UX is more fun when you understand users 🧠🎨",
    },
    {
      name: "Aman Raj",
      text: "Redux Toolkit is literally so easy 😂🔥",
    },
    {
      name: "Yash K",
      text: "Tailwind CSS >>> normal CSS 😭❤️🔥",
    },
    {
      name: "Sakshi Jain",
      text: "JWT + Next.js = perfect combo for security 🔒",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex justify-center rounded-2xl">
      <div className="w-full max-w-xl space-y-6">
        <h1 className="text-3xl font-bold mb-4 tracking-tight">Feed</h1>

        {/* 🔥 Create Post only for logged-in user */}
        {hasToken && (
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Create Post ✍️</h2>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
              rows={3}
            />

            <button
              onClick={handlePost}
              disabled={loading}
              className="mt-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition w-full disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post 🚀"}
            </button>
          </div>
        )}

        {/* Static demo posts */}
        {posts.map((post, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden transition hover:shadow-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex gap-3 items-center">
                <div
                  className={`w-11 h-11 rounded-full ${colors[i]} flex items-center justify-center text-white font-bold shadow`}
                >
                  {post.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </div>

                <div>
                  <h3 className="font-semibold text-base">{post.name}</h3>
                </div>
              </div>

              <button
                onClick={handleFollow}
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-xs font-medium transition"
              >
                Follow
              </button>
            </div>

            {/* Content */}
            <div className="px-4 py-3 space-y-3">
              <p className="text-gray-800 text-[15px] leading-relaxed">
                {post.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
