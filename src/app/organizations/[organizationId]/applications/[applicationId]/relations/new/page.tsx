import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { Header } from "~/src/components/Header";
import { Icon } from "~/src/components/Icon";
import * as api from "~/src/feats/api";
import { getValue, parseValue } from "~/src/feats/relations/api";
import { Form } from "~/src/feats/relations/components/Form";
import { authorize } from "~/src/lib/server/authorization";
import { getFormProps } from "~/src/lib/server/form";
import { getPublicId } from "~/src/lib/shared/publicId";
import { getUrl } from "~/src/lib/shared/url";

export const metadata: Metadata = {
  title: "New relation at Workoelho",
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

  const applications = await api.application.list({
    payload: { page: 1 },
    session,
  });

  const providers = await api.provider.list({ payload: { page: 1 }, session });

  // const projects = await api.project.list({ session });

  const applicationUrl = getUrl(session.organization, application);

  const form = getFormProps(
    async (state, payload) => {
      "use server";

      const session = await authorize({ organizationId });

      await api.relation.create({
        payload: {
          name: payload.get("name"),
          url: payload.get("url"),
          relator: parseValue(payload.get("relator")),
          relatable: parseValue(payload.get("relatable")),
        },
        session,
      });

      redirect(applicationUrl);
    },
    {
      values: {
        relator: getValue({ application }),
      },
    }
  );

  return (
    <Flex direction="column" gap="3rem">
      <Header
        title={application.name}
        description="Adding new relation."
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

      <Form context={{ applications, providers }} {...form} />
    </Flex>
  );
}
