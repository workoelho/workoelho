import type { ReactNode } from "react";

import { Container } from "~/src/components/Container";

type Props = {
  children: ReactNode;
};

export function Paper({ children }: Props) {
  return (
    <Container
      size="large"
      padding="3rem 1.5rem"
      style={{
        boxShadow: "0 0 .375rem hsla(0, 0%, 0%, 5%)",
        backgroundColor: "var(--background)",
        borderRadius: "var(--radius)",
        position: "relative",
      }}
    >
      {children}
    </Container>
  );
}
