import type { Metadata } from "next";

import { getRequestSession, validate } from "~/src/lib/server/session";
import { getFormProps } from "~/src/lib/shared/form";
import { update } from "~/src/feats/users/api/update";
import { Container } from "~/src/components/Container";
import { Flex } from "~/src/components/Flex";
import { Header } from "~/src/components/Header";
import { Heading } from "~/src/components/Heading";
import { authorize } from "~/src/lib/server/authorization";
import { Form } from "~/src/feats/users/components/Form";

export const metadata: Metadata = {
  title: "My profile at Workoelho",
};

type Props = {
  params: {
    organizationId: string;
  };
};

export default async function Page({ params: { organizationId } }: Props) {
  const session = await authorize({ organizationId });

  const form = getFormProps(
    async (state, form) => {
      "use server";

      const session = await getRequestSession();
      validate(session);

      await update({
        payload: {
          id: session.user.id,
          name: form.get("name"),
          email: form.get("email"),
          level: form.get("level"),
        },
        session,
      });

      return { ...state, status: "positive", message: "Changes saved." };
    },
    {
      values: {
        name: session.user.name,
        email: session.user.email,
        level: session.user.level,
      },
    }
  );

  return (
    <Container size="large" padding="3rem">
      <Flex direction="column" gap="3rem">
        <Header>
          <div />

          <Flex direction="column" alignItems="center" gap="0.5rem">
            <Heading as="h1" size="large">
              My profile
            </Heading>

            <p>Update your personal information.</p>
          </Flex>
        </Header>

        <Container size="medium">
          <Form {...form} />
        </Container>
      </Flex>
    </Container>
  );
}
