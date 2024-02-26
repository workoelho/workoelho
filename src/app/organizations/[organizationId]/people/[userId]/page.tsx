import { Fragment } from "react";

import { get } from "~/src/actions/user/get";
import { Button } from "~/src/components/Button";
import { Container } from "~/src/components/Container";
import { Flex } from "~/src/components/Flex";
import { Grid } from "~/src/components/Grid";
import { Heading } from "~/src/components/Heading";
import { Icon } from "~/src/components/Icon";
import { authorize } from "~/src/lib/server/authorization";
import { getPrivateId } from "~/src/lib/shared/publicId";
import { getUrl } from "~/src/lib/shared/url";
import { NotFoundError } from "~/src/lib/shared/errors";
import { list } from "~/src/actions/role";
import { Alert } from "~/src/components/Alert";

type Props = {
  params: {
    organizationId: string;
    userId: string;
  };
};

export default async function Page({ params }: Props) {
  const organizationId = getPrivateId(params.organizationId);
  const userId = getPrivateId(params.userId);

  await authorize({ organizationId });

  const user = await get({ payload: { id: userId } });

  if (!user) {
    throw new NotFoundError();
  }

  const roles = await list({ payload: { userId, page: 1 } });

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
            <p>Viewing profile.</p>
          </Flex>

          <menu>
            <li>
              <Button
                as="a"
                shape="pill"
                href={getUrl("organizations", organizationId, "people")}
              >
                <Icon variant="arrow-left" />
                Back to listing
              </Button>
            </li>
          </menu>
        </Grid>

        <Flex direction="column" gap="1.5rem">
          <Flex alignItems="center" gap="1.5rem">
            <Heading as="h2" size="medium">
              Profile
            </Heading>

            <menu>
              <li>
                <Button
                  as="a"
                  shape="pill"
                  href={getUrl(
                    "organizations",
                    organizationId,
                    "people",
                    user.id,
                    "edit"
                  )}
                >
                  Edit
                </Button>
              </li>
            </menu>
          </Flex>

          <dl>
            <dt>Name:</dt>
            <dd>{user.name}</dd>

            <dt>E-mail:</dt>
            <dd>{user.email}</dd>
          </dl>
        </Flex>

        <Flex direction="column" gap="1.5rem">
          <Heading as="h2" size="medium">
            Roles
          </Heading>

          {roles.length === 0 ? (
            <Alert variant="neutral">No roles.</Alert>
          ) : (
            <dl>
              {roles.map((role) => (
                <Fragment key={role.id}>
                  <dt>{role.application.name}</dt>
                  <dd>{role.name}</dd>
                </Fragment>
              ))}
            </dl>
          )}
        </Flex>
      </Flex>
    </Container>
  );
}
