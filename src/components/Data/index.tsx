import type { ReactNode } from "react";

import classes from "./style.module.css";

type DataProps = {
  children: ReactNode;
};

export function Data({ children }: DataProps) {
  return <ul className={classes.data}>{children}</ul>;
}

type EntryProps = {
  label?: ReactNode;
  children: ReactNode;
};

export function Entry({ label, children }: EntryProps) {
  return (
    <li className={classes.entry}>
      <div className={classes.label}>{label}</div>
      <div className={classes.value}>{children}</div>
    </li>
  );
}

Data.Entry = Entry;
