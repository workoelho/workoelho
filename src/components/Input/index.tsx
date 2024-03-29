import type { ComponentProps } from "react";

import { ClassList } from "~/src/lib/shared/ClassList";

import classes from "./style.module.css";

type Props = ComponentProps<"input">;

export function Input(props: Props) {
  const classList = new ClassList(classes.input);
  if (props.className) {
    classList.add(props.className);
  }

  return <input {...props} className={String(classList)} />;
}
