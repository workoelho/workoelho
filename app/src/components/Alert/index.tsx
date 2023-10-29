import { ReactNode } from "react";

import { ClassList } from "~/lib/client/ClassList";

import classes from "./style.module.css";

type Props = {
  variant?: "positive" | "negative" | "warning" | "neutral";
  children: ReactNode;
};

export function Alert({ variant = "neutral", children }: Props) {
  const classList = new ClassList(classes.alert, classes[variant]);

  return (
    <div className={classList.toString()} role="alert" aria-live="polite">
      {children}
    </div>
  );
}
