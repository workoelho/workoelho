import { type ReactNode } from "react";

import { Flex } from "~/components/Flex";
import { Topbar } from "~/components/Topbar";
import { Footer } from "~/components/Footer";
import { Button } from "~/components/Button";

import classes from "./layout.module.css";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className={classes.layout}>
      <Topbar className={classes.topbar}>
        <Flex as="ul" gap="1.5rem" style={{ flexGrow: 1 }}>
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/applications">Applications</a>
          </li>
          <li>
            <a href="/technology">Technology</a>
          </li>
          <li>
            <a href="/providers">Providers</a>
          </li>
          <li>
            <a href="/tags">Tags</a>
          </li>
          <li>
            <Button shape="pill">Quick add</Button>
          </li>
        </Flex>

        <Flex as="ul" gap="1.5rem">
          <li>
            <a href="/">Arthur C. (Workoelho)</a>
          </li>
        </Flex>
      </Topbar>

      <Flex as="main" direction="column" className={classes.content}>
        {children}
      </Flex>

      <Footer className={classes.footer} />
    </div>
  );
}
