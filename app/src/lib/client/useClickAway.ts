import { useEffect, useRef } from "react";

import { useLiveRef } from "~/src/lib/client/useLiveRef";

export function useClickAway<T extends HTMLElement>(callback: () => void) {
  const elementRef = useRef<T>(null);
  const callbackRef = useLiveRef(callback);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!elementRef.current?.contains(event.target as T)) {
        callbackRef.current();
      }
    };
    document.addEventListener("click", onClick, { capture: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        callbackRef.current();
      }
    };
    document.addEventListener("keydown", onKeyDown, { capture: true });

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, [callbackRef]);

  return elementRef;
}
