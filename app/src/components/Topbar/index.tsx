import { ReactNode } from "react";

import { ClassList } from "~/lib/client/ClassList";
import { Flex } from "~/components/Flex";
import { Button } from "~/components/Button";

import classes from "./style.module.css";

type Props = {
  className?: string;
  children?: ReactNode;
};

export function Topbar({ className, children }: Props) {
  const classList = new ClassList(classes.topbar, className);

  return (
    <Flex
      as="nav"
      className={classList.toString()}
      gap="3rem"
      alignItems="center"
    >
      <h1>
        <a href="/">Workoelho</a>
      </h1>

      {children}
    </Flex>
  );
}
