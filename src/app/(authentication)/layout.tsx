import { type ReactNode } from "react";
import Link from "next/link";

import { Grid } from "~/src/components/Grid";
import { Flex } from "~/src/components/Flex";
import { Brand } from "~/src/components/Brand";
import pkg from "~/package.json";
import { Button } from "~/src/components/Button";
import { Container } from "~/src/components/Container";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Grid template="5rem 1fr 5rem / 1fr" style={{ minHeight: "100vh" }}>
      <Grid
        as="footer"
        alignItems="center"
        template="auto / 1fr auto 1fr"
        style={{ paddingInline: "1.5rem" }}
      >
        <h1>
          <Link href="/">
            <Brand />
          </Link>
        </h1>

        <div />

        <Flex as="ul" gap="1.5rem" style={{ justifySelf: "end" }}>
          <li>
            <Button as={Link} href="/sign-in" shape="text">
              Sign in
            </Button>
          </li>
          <li>
            <Button as={Link} href="/sign-up" shape="text">
              Sign up
            </Button>
          </li>
        </Flex>
      </Grid>

      <main>{children}</main>

      <Grid
        as="footer"
        alignItems="center"
        template="auto / 1fr auto 1fr"
        style={{ paddingInline: "1.5rem" }}
      >
        <p>©️ 2023 Workoelho</p>

        <Flex as="nav" gap="1.5rem">
          <li>
            <Button as={Link} href="/changelog" shape="text">
              What's new?
            </Button>
          </li>
          <li>
            <Button as={Link} href="/help" shape="text">
              Help
            </Button>
          </li>
          <li>
            <Button as={Link} href="https://github.com/workoelho" shape="text">
              GitHub
            </Button>
          </li>
        </Flex>

        <p style={{ justifySelf: "end" }}>Version {pkg.version}</p>
      </Grid>
    </Grid>
  );
}
