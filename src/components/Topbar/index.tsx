import Link from "next/link";
import type { ReactNode } from "react";

import { Brand } from "~/src/components/Brand";
import { ClassList } from "~/src/lib/shared/ClassList";

import classes from "./style.module.css";

type Props = {
  className?: string;
  children?: ReactNode;
};

export function Topbar({ className, children }: Props) {
  const classList = new ClassList(classes.topbar);
  if (className) {
    classList.add(className);
  }

  return (
    <nav className={String(classList)}>
      <h1>
        <Link href="/">
          <Brand size="medium" />
        </Link>
      </h1>

      {children}
    </nav>
  );
}
