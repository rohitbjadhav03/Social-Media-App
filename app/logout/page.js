"use client";

import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    localStorage.removeItem("token");
    window.location.href = "/feed";
  }, []);

  return <p>Logging out...</p>;
}
