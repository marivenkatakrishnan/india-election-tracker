"use client";

import { startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";

export function AutoRefresh({ intervalMs = 60000 }) {
  const router = useRouter();

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      startTransition(() => {
        router.refresh();
      });
    };

    const intervalId = window.setInterval(refresh, intervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [intervalMs, router]);

  return null;
}
