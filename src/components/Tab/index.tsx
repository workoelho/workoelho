"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ClassList } from "~/src/lib/shared/ClassList";

import classes from "./style.module.css";

type Props = {
  href: string;
  children: ReactNode;
  exact?: boolean;
};

export function Tab({ exact, href, children }: Props) {
  const pathname = usePathname();

  const classList = new ClassList(classes.tab);
  if (pathname === href || (!exact && pathname.includes(href))) {
    classList.add(classes.active);
  }

  return (
    <Link href={href} className={String(classList)}>
      {children}
    </Link>
  );
}
