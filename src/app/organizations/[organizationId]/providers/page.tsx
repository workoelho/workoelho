import type { Metadata } from "next";

import { Card } from "~/src/components/Card";
import { Container } from "~/src/components/Container";
import { Flex } from "~/src/components/Flex";
import { Header } from "~/src/components/Header";
import { Heading } from "~/src/components/Heading";
import { authorize } from "~/src/lib/server/authorization";

export const metadata: Metadata = {
  title: "People at Workoelho",
};

type Props = {
  params: {
    organizationId: string;
  };
};

export default async function Page({ params: { organizationId } }: Props) {
  const session = await authorize({ organizationId });

  return (
    <Container size="large" padding="3rem">
      <Flex direction="column" gap="3rem">
        <Header>
          <div />

          <Flex direction="column" alignItems="center" gap="0.5rem">
            <Heading as="h1" size="large">
              Providers
            </Heading>

            <p>Listing all service providers.</p>
          </Flex>
        </Header>

        <Flex justifyContent="center">
          <Card size="large">
            <Heading as="p" size="massive" variant="muted">
              Not implemented.
            </Heading>
          </Card>
        </Flex>
      </Flex>
    </Container>
  );
}
