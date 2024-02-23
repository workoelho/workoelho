import { ReactNode } from "react";

import { ClassList } from "~/src/lib/shared/ClassList";
import { Icon } from "~/src/components/Icon";

import classes from "./style.module.css";

type Props = {
  variant?: "positive" | "negative" | "attentive" | "neutral";
  icon?: string | false;
  children: ReactNode;
};

function getDefaultIcon(variant: string) {
  switch (variant) {
    case "positive":
      return "circled-check";
    case "negative":
    case "attentive":
      return "warning";
    default:
      return "circled-info";
  }
}

export function Alert({ variant = "neutral", icon, children }: Props) {
  const classList = new ClassList(classes.alert, classes[variant]);

  return (
    <div className={classList.toString()} role="alert" aria-live="polite">
      {icon !== false ? (
        <Icon variant={icon ?? getDefaultIcon(variant)} size="1.5em" />
      ) : null}
      <div>{children}</div>
    </div>
  );
}
