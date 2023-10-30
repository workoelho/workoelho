import { type ReactNode } from "react";

import { Flex } from "~/components/Flex";
import { Topbar } from "~/components/Topbar";
import { Footer } from "~/components/Footer";

import classes from "./layout.module.css";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className={classes.layout}>
      <Topbar className={classes.topbar}>
        <Flex as="ul" gap="1.5rem">
          <li>
            <a href="/#features">Features</a>
          </li>
          <li>
            <a href="/changelog">What's new?</a>
          </li>
          <li>
            <a href="/#pricing">Pricing</a>
          </li>
          <li>
            <a href="/sign-up">Sign up</a>
          </li>
          <li>
            <a href="/sign-in">Sign in</a>
          </li>
        </Flex>
      </Topbar>
      <Flex as="main" flexDirection="column" className={classes.content}>
        {children}
      </Flex>
      <Footer className={classes.footer} />
    </div>
  );
}
