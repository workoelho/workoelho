import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { authorize } from "~/src/lib/server/authorization";
import { getUrl } from "~/src/lib/shared/url";
import { getFormProps } from "~/src/lib/shared/form";
import { create } from "~/src/actions/user/create";
import { Modal } from "~/src/components/Modal";
import { getPrivateId } from "~/src/lib/shared/publicId";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "New person at Workoelho",
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

    await authorize({ organizationId });

    await create({
      payload: {
        organizationId: getPrivateId(organizationId),
        name: payload.get("name"),
        email: payload.get("email"),
      },
    });

    redirect(getUrl("organizations", organizationId, "users"));
  });

  return (
    <Modal closeUrl={getUrl("organizations", organizationId, "users")}>
      <Flex direction="column" gap="3rem">
        <Heading as="h1" size="large">
          New person
        </Heading>

        <Form {...form} />
      </Flex>
    </Modal>
  );
}
