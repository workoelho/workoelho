import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { authorize } from "~/src/lib/server/authorization";
import { getUrl } from "~/src/lib/shared/url";
import { getFormProps } from "~/src/lib/shared/form";
import { create } from "~/src/feats/applications/api/create";
import { Modal, Close } from "~/src/components/Modal";
import { Form } from "~/src/feats/applications/components/Form";

export const metadata: Metadata = {
  title: "New application at Workoelho",
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
      },
      session,
    });

    redirect(getUrl("organizations", organizationId, "applications"));
  });

  return (
    <Modal closeUrl={getUrl("organizations", organizationId, "applications")}>
      <Flex direction="column" gap="3rem">
        <Flex
          as="header"
          alignItems="center"
          justifyContent="space-between"
          style={{ height: "1.5rem" }}
        >
          <Flex gap="1.5rem">
            <Heading as="h1" size="medium">
              New application
            </Heading>
          </Flex>

          <Close />
        </Flex>

        <Form {...form} />
      </Flex>
    </Modal>
  );
}
