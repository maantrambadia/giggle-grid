import { useEffect, useRef, useState } from "react";
import { toast } from "@heroui/react";
import api from "@/lib/axios";

const PING_INTERVAL = 5000; // 5 seconds
const FAILURE_THRESHOLD = 3;

export const usePing = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isUnstable, setIsUnstable] = useState(false);
  const failureCountRef = useRef(0);
  const offlineToastShownRef = useRef(false);
  const unstableToastShownRef = useRef(false);

  useEffect(() => {
    const ping = async () => {
      try {
        await api.get("/ping", { timeout: 5000 });

        // Back online after being offline
        if (failureCountRef.current >= FAILURE_THRESHOLD) {
          toast.success("Connection restored.");
        }

        failureCountRef.current = 0;
        setIsOnline(true);
        setIsUnstable(false);
        offlineToastShownRef.current = false;
        unstableToastShownRef.current = false;
      } catch {
        failureCountRef.current += 1;

        if (failureCountRef.current === 1 && !unstableToastShownRef.current) {
          setIsUnstable(true);
          toast.warning("Trying to reconnect.");
          unstableToastShownRef.current = true;
        } else if (
          failureCountRef.current >= FAILURE_THRESHOLD &&
          !offlineToastShownRef.current
        ) {
          setIsOnline(false);
          toast.danger("We can’t reach the server right now.");
          offlineToastShownRef.current = true;
        }
      }
    };

    // Initial ping
    ping();

    const intervalId = setInterval(ping, PING_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  return { isOnline, isUnstable };
};
