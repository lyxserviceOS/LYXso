// components/ReCaptcha.tsx - Google reCAPTCHA component
"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface Props {
  onChange?: (token: string | null) => void;
  onExpired?: () => void;
  onError?: () => void;
  size?: "normal" | "compact" | "invisible";
  theme?: "light" | "dark";
}

export interface ReCaptchaRef {
  reset: () => void;
  execute: () => void;
  getValue: () => string | null;
}

const ReCaptcha = forwardRef<ReCaptchaRef, Props>(
  ({ onChange, onExpired, onError, size = "normal", theme = "light" }, ref) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        recaptchaRef.current?.reset();
      },
      execute: () => {
        recaptchaRef.current?.execute();
      },
      getValue: () => {
        return recaptchaRef.current?.getValue() || null;
      },
    }));

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!siteKey) {
      console.error("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set");
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
          ⚠️ reCAPTCHA er ikke konfigurert riktig. Kontakt support.
        </div>
      );
    }

    return (
      <div className="recaptcha-wrapper">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={siteKey}
          onChange={onChange}
          onExpired={onExpired}
          onErrored={onError}
          size={size}
          theme={theme}
        />
      </div>
    );
  }
);

ReCaptcha.displayName = "ReCaptcha";

export default ReCaptcha;
