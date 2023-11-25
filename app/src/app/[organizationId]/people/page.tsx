import { list } from "~/src/actions/membership";
import { Button } from "~/src/components/Button";
import { Container } from "~/src/components/Container";
import { Flex } from "~/src/components/Flex";
import { Grid } from "~/src/components/Grid";
import { Heading } from "~/src/components/Heading";
import { Icon } from "~/src/components/Icon";
import { getCurrentSession } from "~/src/lib/server/session";
import { getPrivateId } from "~/src/lib/shared/publicId";

type Props = {
  params: {
    organizationId: string;
  };
};

export default async function Page({ params }: Props) {
  const organizationId = getPrivateId(params.organizationId);
  const session = await getCurrentSession();
  const memberships = await list({ query: { organizationId }, session });

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
                all people <Icon name="chevron-down" />
              </Button>
            </p>
          </Flex>

          <menu>
            <li>
              <Button shape="pill">
                Add person <Icon name="plus" />
              </Button>
            </li>
          </menu>
        </Grid>

        <ul>
          {memberships.map((membership) => (
            <li key={membership.userId}>{membership.user.name}</li>
          ))}
        </ul>
      </Flex>
    </Container>
  );
}
