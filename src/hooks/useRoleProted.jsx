"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useRoleAuth from "../hooks/useRoleAuth";

export default function Protected({ role, children }) {
  const [checkingAuth, setCheckingAuth] = useState(true); // Prevents early redirect
  const isAuthenticated = useRoleAuth(role);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated !== null) {
      setCheckingAuth(false);
      if (!isAuthenticated) {
        router.replace("/unauthorize");
      }
    }
  }, [isAuthenticated, router]);

  if (checkingAuth) return null; // Prevent rendering until authentication is checked

  return children;
}
