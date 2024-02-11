import { AnchorHTMLAttributes } from "react";

import { ClassList } from "~/src/lib/client/ClassList";

import classes from "./style.module.css";

type Props = AnchorHTMLAttributes<HTMLAnchorElement>;

export function Link({ ...props }: Props) {
  const classList = new ClassList(classes.link);
  classList.add(props.className);
  props.className = classList.toString();

  return <a {...props} />;
}
