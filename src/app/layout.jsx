"use client";
import { usePathname } from "next/navigation"; // Import usePathname to check the current route
import "./globals.css";
import { LocationProvider } from "../context/LocationContext";
import { ForgotPassEmailProvider } from "../context/ForgotPassEmailContext";
import { SocketProvider } from "../context/SocketContext";
import { persistor, store } from "../redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Protected from "../hooks/useRoleProted";

const Providers = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Get the current path

  // Define public routes that do NOT require authentication
  const publicRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/register", "/auth/reset-password", '/auth/store-register', '/auth/verification-pending', ];

  // Check if the current path is public
  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <html lang="en">
      <head>
        <script src="https://api.mapbox.com/mapbox-gl-js/v3.9.4/mapbox-gl.js"></script>
        <link href="https://api.mapbox.com/mapbox-gl-js/v3.9.4/mapbox-gl.css" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <LocationProvider>
            <ForgotPassEmailProvider>
              <SocketProvider>
                {/* Only protect pages that are NOT in public routes */}
                {isPublicRoute ? (
                  children
                ) : (
                  <Protected role="staff">
                    {children}
                  </Protected>
                )}

                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
              </SocketProvider>
            </ForgotPassEmailProvider>
          </LocationProvider>
        </Providers>
      </body>
    </html>
  );
}
