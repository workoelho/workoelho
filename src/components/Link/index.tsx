import { ComponentProps } from "react";
import { default as NextLink } from "next/link";

import { ClassList } from "~/src/lib/shared/ClassList";

import classes from "./style.module.css";

type Props = ComponentProps<typeof NextLink>;

export function Link({ ...props }: Props) {
  const classList = new ClassList(classes.link);
  classList.add(props.className);
  props.className = classList.toString();

  return <NextLink {...props} />;
}
