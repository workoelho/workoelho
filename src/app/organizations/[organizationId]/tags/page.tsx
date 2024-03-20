import type { Metadata } from "next";

import { Container } from "~/src/components/Container";
import { Empty } from "~/src/components/Empty";
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
              Tags
            </Heading>

            <p>Listing all tags.</p>
          </Flex>
        </Header>

        <Flex justifyContent="center">
          <Empty size="large" title="Not implemented" />
        </Flex>
      </Flex>
    </Container>
  );
}
