import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { authorize } from "~/src/lib/server/authorization";
import { getUrl } from "~/src/lib/shared/url";
import { getFormProps } from "~/src/lib/shared/form";
import { create } from "~/src/actions/user/create";
import { Modal, Close } from "~/src/components/Modal";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "New profile at Workoelho",
};

type Props = {
  params: {
    organizationId: string;
  };
};

export default async function Page({ params: { organizationId } }: Props) {
  await authorize({ organizationId });

  const form = getFormProps(async (state, payload) => {
    "use server";

    const session = await authorize({ organizationId });

    await create({
      payload: {
        name: payload.get("name"),
        email: payload.get("email"),
        level: payload.get("level"),
      },
      session,
    });

    redirect(getUrl("organizations", organizationId, "users"));
  });

  return (
    <Modal closeUrl={getUrl("organizations", organizationId, "users")}>
      <Flex direction="column" gap="3rem">
        <Flex
          as="header"
          alignItems="center"
          justifyContent="space-between"
          style={{ height: "1.5rem" }}
        >
          <Flex gap="1.5rem">
            <Heading as="h1" size="medium">
              New profile
            </Heading>
          </Flex>

          <Close />
        </Flex>

        <Form {...form} />
      </Flex>
    </Modal>
  );
}