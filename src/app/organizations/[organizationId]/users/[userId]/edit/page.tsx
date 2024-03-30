import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { Header } from "~/src/components/Header";
import { Icon } from "~/src/components/Icon";
import * as api from "~/src/feats/api";
import { Form } from "~/src/feats/user/components/Form";
import { authorize } from "~/src/lib/server/authorization";
import { getFormProps } from "~/src/lib/shared/form";
import { formatText } from "~/src/lib/shared/formatting";
import { getUrl } from "~/src/lib/shared/url";

export const metadata: Metadata = {
  title: "Editing user at Workoelho",
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

  const user = await api.user.get({
    payload: { id: userId },
    session,
  });

  const listingUrl = getUrl(session.organization, "users");
  const userUrl = getUrl(session.organization, user);

  const form = getFormProps(
    async (state, payload) => {
      "use server";

      const session = await authorize({ organizationId });

      await api.user.update({
        payload: {
          id: userId,
          name: payload.get("name"),
          email: payload.get("email"),
          level: payload.get("level"),
        },
        session,
      });

      redirect(userUrl);
    },
    {
      values: {
        name: user.name,
        email: user.email,
        level: user.level,
      },
    },
  );

  const destroy = async () => {
    "use server";

    const session = await authorize({ organizationId });

    await api.user.destroy({
      payload: { id: userId },
      session,
    });

    redirect(listingUrl);
  };

  return (
    <Flex direction="column" gap="3rem">
      <Header
        title={formatText(user.name, { shortName: true })}
        description="Editing user."
        right={
          <Flex as="menu">
            <li>
              <Button as={Link} href={userUrl} shape="pill">
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
