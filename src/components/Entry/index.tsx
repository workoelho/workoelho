import type { ReactNode } from "react";

import { ClassList } from "~/src/lib/shared/ClassList";

import classes from "./style.module.css";

type Props = {
  label: ReactNode;
  variant?: "default" | "swap";
  children: ReactNode;
};

export function Entry({ label, variant = "default", children }: Props) {
  const classList = new ClassList(classes.entry, classes[variant]);

  return (
    <article className={String(classList)}>
      <span className={classes.label}>{label}</span>
      <span className={classes.value}>{children}</span>
    </article>
  );
}
