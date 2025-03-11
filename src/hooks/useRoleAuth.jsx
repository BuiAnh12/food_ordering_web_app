import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function useRoleAuth(requiredRole) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const currentUser = useSelector((state) => state?.user?.currentUser);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") || "[]"; // Ensure role is an array

    setIsAuthenticated(
      Boolean(currentUser && userId && token && role.includes(requiredRole))
    );
  }, [currentUser]);

  return isAuthenticated;
}
