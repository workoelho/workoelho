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
import { getFormProps } from "~/src/lib/server/form";
import { formatText } from "~/src/lib/shared/formatting";
import { getUrl } from "~/src/lib/shared/url";

export const metadata: Metadata = {
  title: "New role at Workoelho",
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

  const userUrl = getUrl(session.organization, user);
  const rolesUrl = getUrl(userUrl, "roles");

  const form = getFormProps(
    async (state, payload) => {
      "use server";

      const session = await authorize({ organizationId });

      await api.role.create({
        payload: {
          name: payload.get("name"),
          userId: payload.get("userId"),
          applicationId: payload.get("applicationId"),
        },
        session,
      });

      redirect(userUrl);
    },
    { values: { userId: userId } }
  );

  return (
    <Flex direction="column" gap="3rem">
      <Header
        title={formatText(user.name, { shortName: true })}
        description="Adding new role."
        right={
          <Flex as="menu">
            <li>
              <Button as={Link} href={rolesUrl} shape="pill">
                <Icon variant="arrow-left" />
                Back
              </Button>
            </li>
          </Flex>
        }
      />

      <Form {...form} />
    </Flex>
  );
}
