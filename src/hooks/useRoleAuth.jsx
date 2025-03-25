import { useState, useEffect } from "react";

export default function useRoleAuth(requiredRole) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Start as null to prevent early redirect

  useEffect(() => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      let role = localStorage.getItem("role");

      if (role) {
        try {
          role = JSON.parse(role); // Ensure role is parsed correctly if stored as JSON
        } catch {
          role = [role]; // Fallback if it's a string
        }
      } else {
        role = [];
      }

      if (userId && token && role.includes(requiredRole)) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error in useRoleAuth:", error);
      setIsAuthenticated(false);
    }
  }, [requiredRole]);

  return isAuthenticated;
}
