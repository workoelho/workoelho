import { useRef, useLayoutEffect } from "react";

export function useAutoFocus<T extends HTMLInputElement>() {
  const autoFocusRef = useRef<T>(null);

  useLayoutEffect(() => {
    autoFocusRef.current?.focus();
  }, []);

  return autoFocusRef;
}
