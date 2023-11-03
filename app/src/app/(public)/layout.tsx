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
        <Flex as="ul" gap="1.5rem">
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
            <Button as="a" shape="text" href="/pricing">
              Pricing
            </Button>
          </li>
        </Flex>

        <Flex as="ul" gap="1.5rem">
          <li>
            <Button as="a" shape="pill" variant="primary" href="/sign-up">
              Try it, free
            </Button>
          </li>
        </Flex>

        <div style={{ flexGrow: 1 }} />

        <Flex as="ul" gap="1.5rem">
          <li>
            <Button as="a" shape="text" href="/sign-in">
              Sign in
            </Button>
          </li>
        </Flex>
      </Topbar>

      <main className={classes.main}>{children}</main>

      <Footer className={classes.footer} />
    </div>
  );
}
