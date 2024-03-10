import type { ReactNode } from "react";

import classes from "./style.module.css";

type Props = {
  children: ReactNode;
};

export function Menu({ children }: Props) {
  return <menu className={classes.menu}>{children}</menu>;
}
