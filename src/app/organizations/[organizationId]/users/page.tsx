import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "~/src/components/Button";
import { Card } from "~/src/components/Card";
import { Container } from "~/src/components/Container";
import { Empty } from "~/src/components/Empty";
import { Flex } from "~/src/components/Flex";
import { Grid } from "~/src/components/Grid";
import { Header } from "~/src/components/Header";
import { Heading } from "~/src/components/Heading";
import { Icon } from "~/src/components/Icon";
import { Text } from "~/src/components/Text";
import * as api from "~/src/feats/api";
import { authorize } from "~/src/lib/server/authorization";
import { getUrl } from "~/src/lib/shared/url";

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
  const users = await api.user.list({ payload: { page: 1 }, session });

  return (
    <Container size="large" padding="3rem">
      <Flex direction="column" gap="3rem">
        <Header>
          <div />

          <Flex direction="column" alignItems="center" gap="0.5rem">
            <Heading as="h1" size="large">
              People
            </Heading>

            <p>Listing all people.</p>
          </Flex>

          <Flex as="menu">
            <li>
              <Button
                as={Link}
                href={getUrl(session.organization, "users", "new")}
              >
                Add person <Icon variant="plus" />
              </Button>
            </li>
          </Flex>
        </Header>

        <Grid
          as="ul"
          template="auto / repeat(auto-fit, minmax(30%, 1fr))"
          gap=".75rem"
        >
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user.id}>
                <Link href={getUrl(session.organization, user)}>
                  <Card as="article" key={user.id}>
                    <Heading as="h1" size="tiny">
                      {user.name}
                    </Heading>
                    <Text as="p" variant="muted">
                      {user.email}
                    </Text>
                  </Card>
                </Link>
              </li>
            ))
          ) : (
            <Flex justifyContent="center">
              <Empty size="large" title="No people found." />
            </Flex>
          )}
        </Grid>
      </Flex>
    </Container>
  );
}
