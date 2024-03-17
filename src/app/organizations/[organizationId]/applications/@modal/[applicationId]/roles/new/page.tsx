import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { get } from "~/src/feats/applications/api";
import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { authorize } from "~/src/lib/server/authorization";
import { getPrivateId } from "~/src/lib/shared/publicId";
import { getUrl } from "~/src/lib/shared/url";
import { getFormProps } from "~/src/lib/shared/form";
import { create } from "~/src/feats/roles/api";
import { Close, Modal } from "~/src/components/Modal";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "New role at Workoelho",
};

type Props = {
  params: {
    organizationId: string;
    applicationId: string;
  };
};

export default async function Page({
  params: { organizationId, applicationId },
}: Props) {
  const session = await authorize({ organizationId });

  const application = await get({
    payload: { id: getPrivateId(applicationId) },
    session,
  });

  const listingUrl = getUrl(session.organization, "applications");
  const applicationUrl = getUrl(listingUrl, applicationId);

  const form = getFormProps(async (state, payload) => {
    "use server";

    const session = await authorize({ organizationId });

    await create({
      payload: {
        name: payload.get("name"),
        userId: payload.get("userId"),
        applicationId: getPrivateId(applicationId),
      },
      session,
    });

    redirect(applicationUrl);
  });

  return (
    <Modal closeUrl={listingUrl}>
      <Flex direction="column" gap="3rem">
        <Flex
          as="header"
          alignItems="center"
          justifyContent="space-between"
          style={{ height: "1.5rem" }}
        >
          <Heading as="h1" size="medium">
            New role for {application.name}
          </Heading>

          <Close />
        </Flex>

        <Form {...form} cancelUrl={applicationUrl} />
      </Flex>
    </Modal>
  );
}
