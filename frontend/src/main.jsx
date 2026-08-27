import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toast } from "@heroui/react";
import "@/global.css";
import App from "@/App.jsx";

// Suppress AbortError: Transition was skipped from HeroUI animations
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args[0]?.toString?.() || "";
  if (
    message.includes("AbortError") ||
    message.includes("Transition was skipped")
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};

// Also suppress from unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  const message = event.reason?.toString?.() || "";
  if (
    message.includes("AbortError") ||
    message.includes("Transition was skipped")
  ) {
    event.preventDefault();
  }
});

// Suppress from global error handler
window.addEventListener("error", (event) => {
  const message = event.error?.toString?.() || event.message || "";
  if (
    message.includes("AbortError") ||
    message.includes("Transition was skipped")
  ) {
    event.preventDefault();
    return false;
  }
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Toast.Provider placement="top" />
      <App />
    </BrowserRouter>
  </QueryClientProvider>,
);
