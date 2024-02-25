import Link from "next/link";

import { list } from "~/src/actions/user/list";
import { Button } from "~/src/components/Button";
import { Card } from "~/src/components/Card";
import { Container } from "~/src/components/Container";
import { Flex } from "~/src/components/Flex";
import { Grid } from "~/src/components/Grid";
import { Heading } from "~/src/components/Heading";
import { Icon } from "~/src/components/Icon";
import { Text } from "~/src/components/Text";
import { authorize } from "~/src/lib/server/authorization";
import { getPrivateId } from "~/src/lib/shared/publicId";
import { getUrl } from "~/src/lib/shared/url";

type Props = {
  params: {
    organizationId: string;
  };
};

export default async function Page({ params }: Props) {
  const organizationId = getPrivateId(params.organizationId);

  await authorize({ organizationId });

  const users = await list({ payload: { organizationId } });

  return (
    <Container size="large" padding="3rem">
      <Flex direction="column" gap="3rem">
        <Grid
          as="header"
          template="auto / 1fr auto 1fr"
          gap="3rem"
          alignItems="center"
        >
          <div />

          <Flex direction="column" alignItems="center" gap=".75rem">
            <Heading as="h1" size="large">
              People
            </Heading>
            <p>
              Showing{" "}
              <Button shape="text">
                all people <Icon variant="chevron-down" />
              </Button>
            </p>
          </Flex>

          <menu>
            <li>
              <Button shape="pill">
                Add person <Icon variant="plus" />
              </Button>
            </li>
          </menu>
        </Grid>

        <Grid as="ul" template="auto / 1fr 1fr">
          {users.map((user) => (
            <li key={user.id}>
              <Link
                href={getUrl(
                  "organizations",
                  organizationId,
                  "people",
                  user.id
                )}
              >
                <Card as="article" key={user.id}>
                  <Text as="h1" weight={900}>
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
