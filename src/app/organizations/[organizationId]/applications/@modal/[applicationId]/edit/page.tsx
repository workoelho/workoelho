import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

import { get } from "~/src/actions/application/get";
import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { authorize } from "~/src/lib/server/authorization";
import { getPrivateId } from "~/src/lib/shared/publicId";
import { getUrl } from "~/src/lib/shared/url";
import { getFormProps } from "~/src/lib/shared/form";
import { update } from "~/src/actions/application/update";
import { NotFoundError } from "~/src/lib/shared/errors";
import { Close, Modal } from "~/src/components/Modal";
import { Button } from "~/src/components/Button";
import { Icon } from "~/src/components/Icon";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "Editing application at Workoelho",
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

  const form = getFormProps(
    async (state, payload) => {
      "use server";

      const session = await authorize({ organizationId });

      await update({
        payload: {
          id: getPrivateId(applicationId),
          name: payload.get("name"),
        },
        session,
      });

      redirect(applicationUrl);
    },
    {
      values: {
        name: application.name,
      },
    },
  );

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
            Editing application
          </Heading>

          <Close />
        </Flex>

        <Form {...form} cancelUrl={applicationUrl} />
      </Flex>
    </Modal>
  );
}
