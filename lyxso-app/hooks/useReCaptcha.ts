// hooks/useReCaptcha.ts - Custom hook for reCAPTCHA
import { useRef, useCallback } from 'react';
import { ReCaptchaRef } from '@/components/ReCaptcha';

export function useReCaptcha() {
  const recaptchaRef = useRef<ReCaptchaRef>(null);

  const reset = useCallback(() => {
    recaptchaRef.current?.reset();
  }, []);

  const execute = useCallback(() => {
    recaptchaRef.current?.execute();
  }, []);

  const getValue = useCallback(() => {
    return recaptchaRef.current?.getValue() || null;
  }, []);

  const verify = useCallback(async (token: string): Promise<boolean> => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4200';
      const res = await fetch(`${apiBase}/api/verify-recaptcha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await res.json();
      return data.success === true;
    } catch (err) {
      console.error('reCAPTCHA verification error:', err);
      return false;
    }
  }, []);

  return {
    recaptchaRef,
    reset,
    execute,
    getValue,
    verify
  };
}
