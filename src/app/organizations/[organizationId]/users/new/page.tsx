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
import { getUrl } from "~/src/lib/shared/url";

export const metadata: Metadata = {
  title: "Adding user at Workoelho",
};

type Props = {
  params: {
    organizationId: string;
  };
};

export default async function Page({ params: { organizationId } }: Props) {
  const session = await authorize({ organizationId });

  const listingUrl = getUrl(session.organization, "users");

  const form = getFormProps(async (state, payload) => {
    "use server";

    const session = await authorize({ organizationId });

    await api.user.create({
      payload: {
        name: payload.get("name"),
        email: payload.get("email"),
        level: payload.get("level"),
      },
      session,
    });

    redirect(listingUrl);
  });

  return (
    <Flex direction="column" gap="3rem">
      <Header
        title="People"
        description="Adding new user."
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

      <Form {...form} />
    </Flex>
  );
}
