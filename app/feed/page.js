"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function FeedPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [dbPosts, setDbPosts] = useState([]);
  const [myUserId, setMyUserId] = useState(null);

  // ✅ Get my userId from token payload (simple decode)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setMyUserId(payload.id);
      } catch (e) {
        setMyUserId(null);
      }
    }
  }, []);

  // ✅ Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts/get");
      const data = await res.json();

      if (res.ok) {
        setDbPosts(data.posts || []);
      }
    } catch (err) {
      console.log("Fetch posts error", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ✅ Create post
  const handlePost = async () => {
    if (!content.trim()) return toast.error("Post cannot be empty!");

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
        toast.success("Post created! 🎉");
        setContent("");
        fetchPosts();
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error("Server error");
    }

    setLoading(false);
  };

  // ✅ Delete post
  const handleDelete = async (postId) => {
    // const confirmDelete = confirm("Are you sure you want to delete this post?");
    // if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/posts/delete/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Post deleted ✅");
        fetchPosts();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  // ✅ Avatar
  const getAvatar = (seed) => {
    const safeSeed = seed ? seed.toString() : "1";
    return `https://i.pravatar.cc/150?u=${safeSeed}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8 flex justify-center">
      <div className="w-full max-w-xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Feed ✨
          </h1>

          <p className="text-sm text-gray-500">
            {dbPosts.length} {dbPosts.length === 1 ? "post" : "posts"}
          </p>
        </div>

        {/* ✅ Create Post only if logged in */}
        {hasToken && (
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">
              Create Post ✍️
            </h2>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share something..."
              className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
              rows={3}
            />

            <button
              onClick={handlePost}
              disabled={loading}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 shadow-sm"
            >
              {loading ? "Posting..." : "Post 🚀"}
            </button>
          </div>
        )}

        {/* ✅ Posts */}
        {dbPosts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center text-gray-500">
            <p className="text-lg font-semibold text-gray-900">No posts yet 😅</p>
            <p className="text-sm mt-2">Create your first post to see it here.</p>
          </div>
        ) : (
          dbPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between px-4 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={getAvatar(post.user?._id)}
                    alt="profile"
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />

                  <div>
                    <h3 className="font-semibold text-gray-900 leading-tight">
                      {post.user?.name || "Unknown User"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* ✅ Delete button only for post owner */}
                {myUserId && post.user?._id === myUserId && (
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300 transition text-sm font-semibold"
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-gray-100" />

              {/* Content */}
              <div className="px-4 py-4">
                <p className="text-gray-800 text-[15px] leading-relaxed">
                  {post.content}
                </p>

                {/* Small action bar (optional future likes/comments) */}
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span className="hover:text-gray-700 cursor-pointer transition">
                    ❤️ Like
                  </span>
                  <span className="hover:text-gray-700 cursor-pointer transition">
                    💬 Comment
                  </span>
                  <span className="hover:text-gray-700 cursor-pointer transition">
                    📤 Share
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
