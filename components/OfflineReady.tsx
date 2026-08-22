"use client";

import { useEffect } from "react";

/**
 * Registers the service worker that makes the app work with the network off.
 *
 * Production only, deliberately. In development Next serves build-specific chunks
 * and RSC payloads that change on every edit; a worker caching those hands the new
 * runtime an old payload, and React dies mid-stream with errors like
 * "chunk.reason.enqueueModel is not a function". So in dev we do the opposite —
 * tear down any worker left over from a production build and drop its caches, so a
 * browser that installed one recovers on the next load.
 */
export default function OfflineReady() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      void navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const reg of regs) void reg.unregister();
      });
      if ("caches" in window) {
        void caches.keys().then((keys) => keys.forEach((k) => void caches.delete(k)));
      }
      return;
    }

    const register = () => {
      void navigator.serviceWorker.register("/sw.js").catch(() => {
        // A blocked worker costs offline support, not the app.
      });
    };
    if (document.readyState === "complete") register();
    else {
      window.addEventListener("load", register);
      return () => window.removeEventListener("load", register);
    }
  }, []);
  return null;
}
