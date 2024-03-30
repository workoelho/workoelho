import type { Metadata } from "next";

import { Container } from "~/src/components/Container";
import { Empty } from "~/src/components/Empty";
import { Flex } from "~/src/components/Flex";
import { Header } from "~/src/components/Header";
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
        <Header
          title="Summary"
          description="Latest changes of your organization."
        />

        <Flex justifyContent="center">
          <Empty size="large" title="Not implemented." />
        </Flex>
      </Flex>
    </Container>
  );
}
