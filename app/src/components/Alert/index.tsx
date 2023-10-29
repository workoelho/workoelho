import { ReactNode } from "react";
import classes from "./style.module.css";
import { ClassList } from "~/lib/client/ClassList";

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
