"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const pathname = usePathname();
  const isSlotActive = !pathname.endsWith("/applications");

  return <>{isSlotActive ? children : null}</>;
}
