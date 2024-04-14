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
    payload: { id: applicationId },
    session,
  });

  const listingUrl = getUrl(session.organization, "applications");
  const applicationUrl = getUrl(session.organization, application);

  const form = getFormProps(
    async (state, payload) => {
      "use server";

      const session = await authorize({ organizationId });

      await api.application.update({
        payload: {
          id: applicationId,
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
    }
  );

  const destroy = async () => {
    "use server";

    const session = await authorize({ organizationId });

    await api.application.destroy({
      payload: { id: applicationId },
      session,
    });

    redirect(listingUrl);
  };

  return (
    <Flex direction="column" gap="3rem">
      <Header
        title={application.name}
        description="Editing application."
        left={
          <Flex as="menu">
            <li>
              <Button as={Link} href={applicationUrl} shape="pill">
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
