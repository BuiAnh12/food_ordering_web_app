"use client";
import Protected from "../../hooks/useRoleProted";

export default function ProtectedLayout({ children }) {
  return (
    <Protected role="manager">
        {children}
    </Protected>
  );
}
