// hooks/useAutoLogout.ts
"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { showToast } from "@/lib/toast";

/**
 * Auto-logout hook som logger ut brukeren etter en periode med innaktivitet
 * @param timeoutMinutes - Antall minutter før auto-logout (standard: 30)
 * @param warningMinutes - Antall minutter før logout for å vise varsel (standard: 5)
 */
export function useAutoLogout(timeoutMinutes: number = 30, warningMinutes: number = 5) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      showToast.info("Du ble automatisk logget ut grunnet innaktivitet");
      router.push("/login?timeout=true");
    } catch (error) {
      console.error("Auto-logout feil:", error);
    }
  }, [router]);

  const showWarning = useCallback(() => {
    showToast.warning("Du blir snart logget ut", {
      description: `Beveg musen eller trykk en tast for å fortsette økten. Auto-logout om ${warningMinutes} minutter.`,
    });
  }, [warningMinutes]);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();

    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    // Set warning timer (if configured)
    if (warningMinutes > 0 && warningMinutes < timeoutMinutes) {
      const warningMs = (timeoutMinutes - warningMinutes) * 60 * 1000;
      warningRef.current = setTimeout(showWarning, warningMs);
    }

    // Set logout timer
    const timeoutMs = timeoutMinutes * 60 * 1000;
    timeoutRef.current = setTimeout(logout, timeoutMs);
  }, [timeoutMinutes, warningMinutes, logout, showWarning]);

  useEffect(() => {
    // Sjekk om bruker er innlogget
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // Ikke innlogget, ikke bruk auto-logout
        return;
      }

      // Start timer
      resetTimer();

      // Events som resetter timeren
      const events = [
        "mousedown",
        "mousemove",
        "keypress",
        "scroll",
        "touchstart",
        "click",
      ];

      // Debounce function for å unngå for mange timer resets
      let debounceTimeout: NodeJS.Timeout | null = null;
      const debouncedResetTimer = () => {
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
        debounceTimeout = setTimeout(() => {
          resetTimer();
        }, 1000); // Reset max én gang per sekund
      };

      // Add event listeners
      events.forEach((event) => {
        window.addEventListener(event, debouncedResetTimer);
      });

      // Cleanup
      return () => {
        events.forEach((event) => {
          window.removeEventListener(event, debouncedResetTimer);
        });
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (warningRef.current) {
          clearTimeout(warningRef.current);
        }
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
      };
    };

    checkSession();
  }, [resetTimer]);

  return {
    lastActivity: lastActivityRef.current,
    resetTimer,
  };
}
