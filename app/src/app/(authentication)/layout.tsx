import { type ReactNode } from "react";

import pkg from "~/package.json";
import { Brand } from "~/src/components/Brand";
import { Footer } from "~/src/components/Footer";

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

      <Footer version={pkg.version} className={classes.footer} />
    </div>
  );
}
