import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { Header } from "~/src/components/Header";
import { Icon } from "~/src/components/Icon";
import * as api from "~/src/feats/api";
import { Form } from "~/src/feats/role/components/Form";
import { authorize } from "~/src/lib/server/authorization";
import { getFormProps } from "~/src/lib/shared/form";
import { formatText } from "~/src/lib/shared/formatting";
import { getPublicId } from "~/src/lib/shared/publicId";
import { getUrl } from "~/src/lib/shared/url";

export const metadata: Metadata = {
  title: "Editing user's role at Workoelho",
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
    payload: { id: userId },
    session,
  });

  const role = await api.role.get({
    payload: { id: roleId },
    session,
  });

  const userUrl = getUrl(session.organization, user);
  const listingUrl = getUrl(userUrl, "roles");

  const form = getFormProps(
    async (state, payload) => {
      "use server";

      const session = await authorize({ organizationId });

      await api.role.update({
        payload: {
          id: roleId,
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
        userId: getPublicId(role.user),
        applicationId: getPublicId(role.application),
      },
    },
  );

  const destroy = async () => {
    "use server";

    const session = await authorize({ organizationId });

    await api.role.destroy({
      payload: { id: roleId },
      session,
    });

    redirect(userUrl);
  };

  return (
    <Flex direction="column" gap="3rem">
      <Header
        title={formatText(role.name, { shortName: true })}
        description="Editing role."
        right={
          <Flex as="menu">
            <li>
              <Button as={Link} href={listingUrl} shape="pill">
                <Icon variant="arrow-left" />
                Back
              </Button>
            </li>
          </Flex>
        }
      />

      <Form {...form} destroy={destroy} />
    </Flex>
  );
}
