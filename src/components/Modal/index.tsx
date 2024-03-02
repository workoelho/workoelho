"use client";

import type { ElementRef, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";

import { Icon } from "~/src/components/Icon";

import classes from "./style.module.css";

type Props = {
  closeUrl?: string;
  children: ReactNode;
};

export function Modal({ children, closeUrl }: Props) {
  const router = useRouter();
  const dialogRef = useRef<ElementRef<"dialog">>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  const onClose = () => {
    if (closeUrl) {
      router.push(closeUrl);
    }
  };

  return (
    <dialog ref={dialogRef} className={classes.modal} onClose={onClose}>
      <button
        className={classes.close}
        onClick={() => dialogRef.current?.close()}
      >
        <Icon variant="x" />
      </button>

      {children}
    </dialog>
  );
}
