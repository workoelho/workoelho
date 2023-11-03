import { type ReactNode } from "react";

import { Footer } from "~/components/Footer";
import { Brand } from "~/components/Brand";
import { Flex } from "~/components/Flex";

import classes from "./layout.module.css";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className={classes.layout}>
      <main className={classes.main}>
        <h1 className={classes.brand}>
          <a href="/">
            <Brand size="large" />
          </a>
        </h1>

        {children}
      </main>

      <Footer className={classes.footer} />
    </div>
  );
}
