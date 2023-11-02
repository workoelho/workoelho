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
            <Button as="a" shape="text" href="/#introduction">
              Introduction
            </Button>
          </li>
          <li>
            <Button as="a" shape="text" href="/#features">
              Features
            </Button>
          </li>
          <li>
            <Button as="a" shape="text" href="/#cases">
              Cases
            </Button>
          </li>
          <li>
            <Button as="a" shape="text" href="/#pricing">
              Pricing
            </Button>
          </li>
          <li>
            <Button as="a" shape="pill" variant="primary" href="/sign-up">
              Try it, free
            </Button>
          </li>
        </Flex>

        <ul>
          <li>
            <Button as="a" shape="text" href="/sign-in">
              Sign in
            </Button>
          </li>
        </ul>
      </Topbar>
      <Flex as="main" direction="column" className={classes.content}>
        {children}
      </Flex>
      <Footer className={classes.footer} />
    </div>
  );
}
