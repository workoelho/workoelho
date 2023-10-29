import { ReactNode } from "react";

import classes from "./style.module.css";

type Props = {
  children: ReactNode;
};

export function Layout({ children }: Props) {
  return <div className={classes.layout}>{children}</div>;
}
