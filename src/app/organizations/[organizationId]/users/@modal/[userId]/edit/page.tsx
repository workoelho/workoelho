import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

import * as Users from "~/src/actions/user";
import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { authorize } from "~/src/lib/server/authorization";
import { getPrivateId } from "~/src/lib/shared/publicId";
import { getUrl } from "~/src/lib/shared/url";
import { getFormProps } from "~/src/lib/shared/form";
import { update } from "~/src/actions/user/update";
import { NotFoundError } from "~/src/lib/shared/errors";
import { Close, Modal } from "~/src/components/Modal";
import { Button } from "~/src/components/Button";
import { Icon } from "~/src/components/Icon";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "Editing person at Workoelho",
};

type Props = {
  params: {
    organizationId: string;
    userId: string;
  };
};

export default async function Page({
  params: { organizationId, userId },
}: Props) {
  const session = await authorize({ organizationId });

  const user = await Users.get({
    payload: { id: getPrivateId(userId) },
    session,
  });

  const listingUrl = getUrl(session.organization, "users");
  const userUrl = getUrl(listingUrl, userId);

  const form = getFormProps(
    async (state, payload) => {
      "use server";

      const session = await authorize({ organizationId });

      await update({
        payload: {
          id: getPrivateId(userId),
          name: payload.get("name"),
          email: payload.get("email"),
          level: payload.get("level"),
        },
        session,
      });

      redirect(userUrl);
    },
    { values: { name: user.name, email: user.email, level: user.level } },
  );

  const destroy = async () => {
    "use server";

    const session = await authorize({ organizationId });

    await Users.destroy({ payload: { id: getPrivateId(userId) }, session });

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
            Editing person
          </Heading>

          <Close />
        </Flex>

        <Form {...form} destroy={destroy} cancelUrl={userUrl} />
      </Flex>
    </Modal>
  );
}
