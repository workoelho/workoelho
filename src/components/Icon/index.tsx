import type { CSSProperties } from "react";

import { ClassList } from "~/src/lib/shared/ClassList";

import classes from "./style.module.css";

type Props = {
  variant: string;
  label?: string;
  className?: string;
  size?: CSSProperties["fontSize"];
  style?: CSSProperties;
};

export function Icon({ variant, label, size = "1em", ...props }: Props) {
  const classList = new ClassList(classes.icon);
  if (props.className) {
    classList.add(props.className);
  }

  const style = {
    fontSize: size,
    ...props.style,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={String(classList)}
      style={style}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
    >
      <use xlinkHref={`/icon.svg#${variant}`} />
    </svg>
  );
}
