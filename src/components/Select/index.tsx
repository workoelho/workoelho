import type { ComponentProps } from "react";

import { ClassList } from "~/src/lib/shared/ClassList";

import classes from "./style.module.css";

type Props = ComponentProps<"select">;

export function Select(props: Props) {
  const classList = new ClassList(classes.select);
  if (props.className) {
    classList.add(props.className);
  }

  return <select {...props} className={String(classList)} />;
}
