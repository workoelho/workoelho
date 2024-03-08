"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  modal: ReactNode;
};

export default function Layout({ children, modal }: Props) {
  const pathname = usePathname();
  const isModalSlotActive = !pathname.endsWith("/users");

  return (
    <>
      {children}
      {isModalSlotActive ? modal : null}
    </>
  );
}
