"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const pathname = usePathname();
  const isSlotActive = !pathname.endsWith("/users");

  return <>{isSlotActive ? children : null}</>;
}
