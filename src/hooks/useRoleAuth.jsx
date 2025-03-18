import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function useRoleAuth(requiredRole) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const currentUser = useSelector((state) => state?.user?.currentUser);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const role = JSON.parse(localStorage.getItem("role") || "[]"); // Ensure an array

    if (currentUser && userId && token && role.includes(requiredRole)) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [currentUser, requiredRole]);

  return isAuthenticated;
}
