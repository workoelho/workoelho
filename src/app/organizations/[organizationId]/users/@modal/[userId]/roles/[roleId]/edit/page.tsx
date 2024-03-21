import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { Close, Modal } from "~/src/components/Modal";
import * as api from "~/src/feats/api";
import { Form } from "~/src/feats/role/components/Form";
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
    userId: string;
    roleId: string;
  };
};

export default async function Page({
  params: { organizationId, userId, roleId },
}: Props) {
  const session = await authorize({ organizationId });

  const user = await api.user.get({
    payload: { id: getPrivateId(userId) },
    session,
  });

  const role = await api.role.get({
    payload: { id: getPrivateId(roleId) },
    session,
  });

  const listingUrl = getUrl(session.organization, "users");
  const userUrl = getUrl(listingUrl, userId);

  const form = getFormProps(
    async (state, payload) => {
      "use server";

      const session = await authorize({ organizationId });

      await api.role.update({
        payload: {
          id: getPrivateId(roleId),
          name: payload.get("name"),
          userId: payload.get("userId"),
          applicationId: payload.get("applicationId"),
        },
        session,
      });

      redirect(userUrl);
    },
    {
      values: {
        name: role.name,
        userId: role.userId,
        applicationId: role.applicationId,
      },
    },
  );

  const destroy = async () => {
    "use server";

    const session = await authorize({ organizationId });

    await api.role.destroy({
      payload: { id: getPrivateId(roleId) },
      session,
    });

    redirect(userUrl);
  };

  return (
    <Modal closeUrl={listingUrl}>
      <Flex direction="column" gap="3rem">
        <Flex as="header" justifyContent="space-between">
          <Heading as="h1" size="medium">
            Editing role for {user.name}
          </Heading>

          <Close />
        </Flex>

        <Form {...form} cancelUrl={userUrl} destroy={destroy} />
      </Flex>
    </Modal>
  );
}
