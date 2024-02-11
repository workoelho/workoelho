import { type ReactNode } from "react";

import classes from "./style.module.css";

type Props = { children: ReactNode };

export function Feedback({ children }: Props) {
  return <div className={classes.feedback}>{children}</div>;
}
