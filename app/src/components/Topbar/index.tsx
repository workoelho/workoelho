import { ReactNode } from "react";

import { ClassList } from "~/lib/client/ClassList";
import { Flex } from "~/components/Flex";
import { Brand } from "~/components/Brand";

import classes from "./style.module.css";

type Props = {
  className?: string;
  children?: ReactNode;
};

export function Topbar({ className, children }: Props) {
  const classList = new ClassList(classes.topbar, className);

  return (
    <Flex as="nav" gap="3rem" className={classList.toString()}>
      <h1>
        <a href="/">
          <Brand size="medium" />
        </a>
      </h1>

      {children}
    </Flex>
  );
}
