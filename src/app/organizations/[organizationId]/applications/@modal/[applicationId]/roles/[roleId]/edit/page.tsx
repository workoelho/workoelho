import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { Close, Modal } from "~/src/components/Modal";
import * as Applications from "~/src/feats/applications/api";
import * as Roles from "~/src/feats/roles/api";
import { Form } from "~/src/feats/roles/components/Form";
import { authorize } from "~/src/lib/server/authorization";
import { getFormProps } from "~/src/lib/shared/form";
import { getPrivateId } from "~/src/lib/shared/publicId";
import { getUrl } from "~/src/lib/shared/url";

export const metadata: Metadata = {
  title: "Editing role at Workoelho",
};

type Props = {
  params: {
    organizationId: string;
    applicationId: string;
    roleId: string;
  };
};

export default async function Page({
  params: { organizationId, applicationId, roleId },
}: Props) {
  const session = await authorize({ organizationId });

  const application = await Applications.get({
    payload: { id: getPrivateId(applicationId) },
    session,
  });

  const role = await Roles.get({
    payload: { id: getPrivateId(roleId) },
    session,
  });

  const listingUrl = getUrl(session.organization, "applications");
  const applicationUrl = getUrl(listingUrl, applicationId);

  const form = getFormProps(
    async (state, payload) => {
      "use server";

      const session = await authorize({ organizationId });

      await Roles.update({
        payload: {
          id: getPrivateId(roleId),
          name: payload.get("name"),
          userId: payload.get("userId"),
        },
        session,
      });

      redirect(applicationUrl);
    },
    { values: { name: role.name, userId: String(role.userId) } }
  );

  const destroy = async () => {
    "use server";

    const session = await authorize({ organizationId });

    await Roles.destroy({
      payload: { id: getPrivateId(roleId) },
      session,
    });

    redirect(applicationUrl);
  };

  return (
    <Modal closeUrl={listingUrl}>
      <Flex direction="column" gap="3rem">
        <Flex as="header" justifyContent="space-between">
          <Heading as="h1" size="medium">
            Editing role for {application.name}
          </Heading>

          <Close />
        </Flex>

        <Form {...form} cancelUrl={applicationUrl} destroy={destroy} />
      </Flex>
    </Modal>
  );
}
