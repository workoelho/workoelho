import { ReactNode } from "react";

import { Brand } from "~/src/components/Brand";
import { ClassList } from "~/src/lib/client/ClassList";

import classes from "./style.module.css";

type Props = {
  className?: string;
  children?: ReactNode;
};

export function Topbar({ className, children }: Props) {
  const classList = new ClassList(classes.topbar, className);

  return (
    <nav className={classList.toString()}>
      <h1>
        <a href="/">
          <Brand size="medium" />
        </a>
      </h1>

      {children}
    </nav>
  );
}
