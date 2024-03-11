"use client";

import type { ElementRef, MouseEvent, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { Icon } from "~/src/components/Icon";
import { Button } from "~/src/components/Button";

import classes from "./style.module.css";

type Props = {
  closeUrl?: string;
  children: ReactNode;
};

export function Modal({ children, closeUrl }: Props) {
  const dialogRef = useRef<ElementRef<"dialog">>(null);
  const router = useRouter();

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
      {children}
    </dialog>
  );
}

export function Close() {
  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    const dialog = event.currentTarget.closest("dialog");
    if (!dialog) {
      throw new Error("Could not find dialog to close");
    }
    dialog.close();
  };

  return (
    <Button onClick={onClick} shape="text">
      <Icon variant="x" size="1.5rem" />
    </Button>
  );
}

Modal.Close = Close;
