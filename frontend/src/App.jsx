import { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { AuthProvider } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Chip } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CellularNetworkOfflineIcon,
  Alert02Icon,
} from "@hugeicons/core-free-icons";
import { usePing } from "@/hooks/usePing";

import FeedPage from "@/pages/FeedPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import UploadPage from "@/pages/UploadPage";
import NotFoundPage from "@/pages/NotFoundPage";

const RouteTransition = ({ children }) => {
  const MotionDiv = motion.div;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 10, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.99 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </MotionDiv>
  );
};

const NetworkStatus = () => {
  const { isOnline, isUnstable } = usePing();

  if (isOnline && !isUnstable) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999]">
      {!isOnline ? (
        <Chip color="danger">
          <HugeiconsIcon
            icon={CellularNetworkOfflineIcon}
            strokeWidth={2}
            className="size-3"
          />
          <Chip.Label>Disconnected</Chip.Label>
        </Chip>
      ) : (
        <Chip color="warning">
          <HugeiconsIcon
            icon={Alert02Icon}
            strokeWidth={2}
            className="size-3"
          />
          <Chip.Label>Reconnecting</Chip.Label>
        </Chip>
      )}
    </div>
  );
};

const App = () => {
  const location = useLocation();

  return (
    <AuthProvider>
      <NetworkStatus />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <Suspense fallback={<Loading />}>
                <RouteTransition>
                  <FeedPage />
                </RouteTransition>
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense fallback={<Loading />}>
                <RouteTransition>
                  <LoginPage />
                </RouteTransition>
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense fallback={<Loading />}>
                <RouteTransition>
                  <RegisterPage />
                </RouteTransition>
              </Suspense>
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/upload"
              element={
                <Suspense fallback={<Loading />}>
                  <RouteTransition>
                    <UploadPage />
                  </RouteTransition>
                </Suspense>
              }
            />
          </Route>

          <Route
            path="*"
            element={
              <Suspense fallback={<Loading />}>
                <RouteTransition>
                  <NotFoundPage />
                </RouteTransition>
              </Suspense>
            }
          />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
};

export default App;
