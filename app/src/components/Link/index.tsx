import { AnchorHTMLAttributes, HTMLAttributes } from "react";

import { ClassList } from "~/lib/client/ClassList";

import classes from "./style.module.css";

type Props = AnchorHTMLAttributes<HTMLAnchorElement>;

export function Link({ ...props }: Props) {
  const classList = new ClassList(classes.link);
  classList.add(props.className);
  props.className = classList.toString();

  return <a {...props} />;
}
