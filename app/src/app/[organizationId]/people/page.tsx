import { list } from "~/src/actions/membership";
import { getCurrentSession } from "~/src/lib/server/session";
import { getPrivateId } from "~/src/lib/shared/publicId";
import { Button } from "~/src/components/Button";
import { Container } from "~/src/components/Container";
import { Flex } from "~/src/components/Flex";
import { Grid } from "~/src/components/Grid";
import { Heading } from "~/src/components/Heading";

type Props = {
  params: {
    organizationId: string;
  };
};

export default async function Page({ params }: Props) {
  const organizationId = getPrivateId(params.organizationId);
  const session = await getCurrentSession();
  const memberships = await list({ data: { organizationId }, session });

  return (
    <Container size="large" padding="3rem">
      <Flex direction="column" gap="3rem">
        <Grid
          as="header"
          template="auto / 1fr auto 1fr"
          gap="3rem"
          alignItems="center"
        >
          <Heading as="h1" size="large" style={{ gridColumn: 2 }}>
            People
          </Heading>
          <menu>
            <li>
              <Button>Add person</Button>
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
