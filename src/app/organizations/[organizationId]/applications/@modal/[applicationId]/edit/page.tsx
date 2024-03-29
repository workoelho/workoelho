import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { Close, Modal } from "~/src/components/Modal";
import * as api from "~/src/feats/api";
import { Form } from "~/src/feats/application/components/Form";
import { authorize } from "~/src/lib/server/authorization";
import { getFormProps } from "~/src/lib/shared/form";
import { getPrivateId } from "~/src/lib/shared/publicId";
import { getUrl } from "~/src/lib/shared/url";

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

  const application = await api.application.get({
    payload: { id: getPrivateId(applicationId) },
    session,
  });

  const listingUrl = getUrl(session.organization, "applications");
  const applicationUrl = getUrl(listingUrl, applicationId);

  const form = getFormProps(
    async (state, payload) => {
      "use server";

      const session = await authorize({ organizationId });

      await api.application.update({
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

  const destroy = async () => {
    "use server";

    const session = await authorize({ organizationId });

    await api.application.destroy({
      payload: { id: getPrivateId(applicationId) },
      session,
    });

    redirect(listingUrl);
  };

  return (
    <Modal closeUrl={listingUrl}>
      <Flex direction="column" gap="3rem">
        <Flex as="header" justifyContent="space-between">
          <Heading as="h1" size="medium">
            Editing application
          </Heading>

          <Close />
        </Flex>

        <Form {...form} destroy={destroy} cancelUrl={applicationUrl} />
      </Flex>
    </Modal>
  );
}
