import { ReactNode } from "react";

import { ClassList } from "~/src/lib/shared/ClassList";

import classes from "./style.module.css";

type Props = {
  variant?: "positive" | "negative" | "attentive" | "neutral";
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
