import type { Metadata } from "next";

import { Container } from "~/src/components/Container";
import { Flex } from "~/src/components/Flex";
import { Header } from "~/src/components/Header";
import * as api from "~/src/feats/api";
import { Form } from "~/src/feats/user/components/Form";
import { authorize } from "~/src/lib/server/authorization";
import { getRequestSession, validate } from "~/src/lib/server/session";
import { getFormProps } from "~/src/lib/shared/form";

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

      await api.user.update({
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
    },
  );

  return (
    <Container size="large" padding="3rem">
      <Flex direction="column" gap="3rem">
        <Header
          title="My profile"
          description="Update your personal information."
        />

        <Container size="medium">
          <Form {...form} />
        </Container>
      </Flex>
    </Container>
  );
}
