"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        <Link href="/">SocialApp</Link>
      </h1>

      <div className="flex gap-6 text-gray-700 font-medium">
        <Link href="/" className="hover:text-blue-600 transition">
          Home
        </Link>

        {!isLoggedIn && (
          <>
            <Link href="/register" className="hover:text-blue-600 transition">
              Register
            </Link>

            <Link href="/login" className="hover:text-blue-600 transition">
              Login
            </Link>
          </>
        )}

        {isLoggedIn && (
          <Link href="/logout" className="hover:text-red-600 transition">
            Logout
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
