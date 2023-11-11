"use client";

import { ReactNode } from "react";

import { ClassList } from "~/src/lib/client/ClassList";
import { useClickAway } from "~/src/lib/client/useClickAway";
import { useToggle } from "~/src/lib/client/useToggle";

import classes from "./style.module.css";

type Props = {
  placement: "left" | "right";
  children: ReactNode;
  trigger: ReactNode;
};

export function Popover({ placement = "left", trigger, children }: Props) {
  const [expanded, toggle] = useToggle(false);
  const ref = useClickAway<HTMLDivElement>(() => toggle(false));

  const classList = new ClassList(classes.popover, classes[placement]);
  if (expanded) {
    classList.add(classes.expanded);
  }

  const onClick = () => {
    toggle(true);
  };

  return (
    <div className={classList.toString()} ref={ref} onClick={onClick}>
      {trigger}

      <div className={classes.content}>{children}</div>
    </div>
  );
}
