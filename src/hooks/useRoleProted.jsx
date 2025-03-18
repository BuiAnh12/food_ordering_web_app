"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useRoleAuth from "../hooks/useRoleAuth";
import useUserAuth from "./useUserAuth";

export default function Protected({ role, children }) {
  const isAuthenticated = useRoleAuth(role);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
       router.replace("/unauthorize"); // Redirect before rendering content
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null; // Prevent flashing content

  return children;
}
