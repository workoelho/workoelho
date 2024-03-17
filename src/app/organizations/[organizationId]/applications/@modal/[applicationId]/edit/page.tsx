import type { Metadata } from "next";
import { redirect } from "next/navigation";

import * as Applications from "~/src/feats/applications/api";
import { Form } from "~/src/feats/applications/components/Form";
import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { authorize } from "~/src/lib/server/authorization";
import { getPrivateId } from "~/src/lib/shared/publicId";
import { getUrl } from "~/src/lib/shared/url";
import { getFormProps } from "~/src/lib/shared/form";
import { Close, Modal } from "~/src/components/Modal";

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

  const application = await Applications.get({
    payload: { id: getPrivateId(applicationId) },
    session,
  });

  const listingUrl = getUrl(session.organization, "applications");
  const applicationUrl = getUrl(listingUrl, applicationId);

  const form = getFormProps(
    async (state, payload) => {
      "use server";

      const session = await authorize({ organizationId });

      await Applications.update({
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

    await Applications.destroy({
      payload: { id: getPrivateId(applicationId) },
      session,
    });

    redirect(listingUrl);
  };

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

        <Form {...form} destroy={destroy} cancelUrl={applicationUrl} />
      </Flex>
    </Modal>
  );
}
