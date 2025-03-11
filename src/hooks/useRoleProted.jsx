"use client";
import { useRouter } from "next/navigation";
import useRoleAuth from "./useRoleAuth";
import { useEffect } from "react";

export default function Protected({ role, children }) {
  const router = useRouter();
  const isAuthenticated = useRoleAuth(role);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/unauthorize");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === null) return null;

  return children;
}
