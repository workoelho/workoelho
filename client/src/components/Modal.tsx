import { type ReactNode, type RefObject, useLayoutEffect } from "react";

type Props = {
  open?: boolean;
  dialog?: RefObject<HTMLDialogElement>;
  children: ReactNode;
};

export function Modal({ dialog, open, children }: Props) {
  useLayoutEffect(() => {
    if (open) {
      dialog?.current?.showModal();
    } else {
      dialog?.current?.close();
    }
  }, [open, dialog]);

  return (
    <dialog
      ref={dialog}
      className="container p-6 m-auto border border-zinc-700 rounded max-w-[40rem] text-zinc-100 bg-zinc-900 backdrop:bg-opacity-50 backdrop:bg-zinc-900 backdrop:backdrop-blur-sm backdrop:p-6"
    >
      {children}
    </dialog>
  );
}
