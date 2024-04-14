import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { Header } from "~/src/components/Header";
import { Icon } from "~/src/components/Icon";
import * as api from "~/src/feats/api";
import { Form } from "~/src/feats/application/components/Form";
import { authorize } from "~/src/lib/server/authorization";
import { getFormProps } from "~/src/lib/server/form";
import { getUrl } from "~/src/lib/shared/url";

export const metadata: Metadata = {
  title: "New application at Workoelho",
};

type Props = {
  params: {
    organizationId: string;
  };
};

export default async function Page({ params: { organizationId } }: Props) {
  const session = await authorize({ organizationId });

  const listingUrl = getUrl(session.organization, "applications");

  const form = getFormProps(async (state, payload) => {
    "use server";

    const session = await authorize({ organizationId });

    await api.application.create({
      payload: {
        name: payload.get("name"),
      },
      session,
    });

    redirect(listingUrl);
  });

  return (
    <Flex direction="column" gap="3rem">
      <Header
        title="Applications"
        description="Creating new application."
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
