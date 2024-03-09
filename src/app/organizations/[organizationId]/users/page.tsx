import type { Metadata } from "next";
import Link from "next/link";

import { list } from "~/src/actions/user/list";
import { Button } from "~/src/components/Button";
import { Card } from "~/src/components/Card";
import { Container } from "~/src/components/Container";
import { Flex } from "~/src/components/Flex";
import { Grid } from "~/src/components/Grid";
import { Header } from "~/src/components/Header";
import { Heading } from "~/src/components/Heading";
import { Icon } from "~/src/components/Icon";
import { Text } from "~/src/components/Text";
import { authorize } from "~/src/lib/server/authorization";
import { getPrivateId } from "~/src/lib/shared/publicId";
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

  const users = await list({
    payload: { organizationId: getPrivateId(organizationId) },
    session,
  });

  return (
    <Container size="large" padding="3rem">
      <Flex direction="column" gap="3rem">
        <Header>
          <div />

          <Flex direction="column" alignItems="center" gap="0.75rem">
            <Heading as="h1" size="large">
              People
            </Heading>

            <p>
              Listing{" "}
              <Button shape="text">
                all people <Icon variant="chevron-down" />
              </Button>
              .
            </p>
          </Flex>

          <menu>
            <li>
              <Button
                as={Link}
                href={getUrl("organizations", organizationId, "users", "new")}
              >
                Add person <Icon variant="plus" />
              </Button>
            </li>
          </menu>
        </Header>

        <Grid as="ul" template="auto / 1fr 1fr 1fr" gap=".75rem">
          {users.map((user) => (
            <li key={user.id}>
              <Link
                href={getUrl("organizations", organizationId, "users", user.id)}
              >
                <Card as="article" key={user.id}>
                  <Text as="h1" weight="bolder">
                    {user.name}
                  </Text>
                  <Text as="p" variant="muted">
                    {user.email}
                  </Text>
                </Card>
              </Link>
            </li>
          ))}
        </Grid>
      </Flex>
    </Container>
  );
}
