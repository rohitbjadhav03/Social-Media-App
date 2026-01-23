"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Login failed");
      return;
    }

    toast.success("Login successful! 🎉");

    localStorage.setItem("token", data.token);

    setTimeout(() => {
      window.location.href = "/feed";
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 rounded-2xl">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-gray-700 text-sm font-medium">Email</label>
            <input
              className="border border-gray-300 p-3 w-full rounded-lg mt-1 outline-none focus:ring-2 focus:ring-indigo-500"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm font-medium">
              Password
            </label>
            <input
              className="border border-gray-300 p-3 w-full rounded-lg mt-1 outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;
