import type { ReactNode } from "react";

import { Container } from "~/src/components/Container";

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  return (
    <Container size="large" padding="3rem">
      {children}
    </Container>
  );
}
