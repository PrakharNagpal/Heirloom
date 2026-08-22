"use client";

import { useEffect } from "react";

/**
 * Registers the service worker that makes the app work with the network off.
 * Deliberately silent — there is nothing for anyone to do about it, so there is
 * nothing to say on screen.
 */
export default function OfflineReady() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
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
