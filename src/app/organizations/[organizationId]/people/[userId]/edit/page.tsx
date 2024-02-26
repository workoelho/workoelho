import type { Metadata } from "next";
import { redirect } from "next/navigation";

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
import { getFormProps } from "~/src/lib/shared/form";
import { update } from "~/src/actions/user/update";
import { NotFoundError } from "~/src/lib/shared/errors";

import { Form } from "./form";

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

  const form = getFormProps(
    async (state, payload) => {
      "use server";

      await authorize({ organizationId });

      await update({ payload: { id: userId, ...payload } });

      redirect(getUrl("organizations", organizationId, "people", userId));
    },
    { values: { name: user.name, email: user.email } }
  );

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
              Editing profile for <strong>{user.name}</strong>.
            </p>
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

        <Form {...form} />
      </Flex>
    </Container>
  );
}
