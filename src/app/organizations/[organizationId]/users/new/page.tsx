import { redirect } from "next/navigation";

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
import { create } from "~/src/actions/user/create";

import { Form } from "./form";

type Props = {
  params: {
    organizationId: string;
  };
};

export default async function Page({ params }: Props) {
  const organizationId = getPrivateId(params.organizationId);

  await authorize({ organizationId });

  const form = getFormProps(async (state, payload) => {
    "use server";

    await authorize({ organizationId });

    await create({
      payload: {
        organizationId,
        name: payload.get("name"),
        email: payload.get("email"),
      },
    });

    redirect(getUrl("organizations", organizationId, "users"));
  });

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
            <p>Adding new user.</p>
          </Flex>

          <menu>
            <li>
              <Button
                as="a"
                shape="pill"
                href={getUrl("organizations", organizationId, "users")}
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
