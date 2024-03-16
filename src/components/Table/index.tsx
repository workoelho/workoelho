import type { ComponentProps } from "react";

import { ClassList } from "~/src/lib/shared/ClassList";

import classes from "./style.module.css";

type Props = ComponentProps<"table">;

export function Table({ ...props }: Props) {
  const classList = new ClassList(classes.table);
  if (props.className) {
    classList.add(props.className);
  }
  props.className = String(classList);

  return <table {...props} />;
}
