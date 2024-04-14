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
import { filterKeys } from "~/src/lib/shared/filterKeys";
import { getFormProps } from "~/src/lib/server/form";
import { mapObject } from "~/src/lib/shared/mapObject";
import { getPublicId } from "~/src/lib/shared/publicId";
import { getUrl } from "~/src/lib/shared/url";

export const metadata: Metadata = {
  title: "Editing relation at Workoelho",
};

type Props = {
  params: {
    organizationId: string;
    applicationId: string;
    relationId: string;
  };
};

export default async function Page({
  params: { organizationId, applicationId, relationId },
}: Props) {
  const session = await authorize({ organizationId });

  const application = await api.application.get({
    payload: { id: applicationId },
    session,
  });

  const relation = await api.relation.get({
    payload: { id: relationId },
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

      await api.relation.update({
        payload: {
          id: relationId,
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
        name: relation.name,
        url: relation.url ?? "",
        relator: getValue(relation.relator),
        relatable: getValue(relation.relatable),
      },
    }
  );

  const destroy = async () => {
    "use server";

    const session = await authorize({ organizationId });

    await api.relation.destroy({
      payload: { id: relationId },
      session,
    });

    redirect(applicationUrl);
  };

  return (
    <Flex direction="column" gap="3rem">
      <Header
        title={application.name}
        description="Editing relation."
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

      <Form {...form} destroy={destroy} context={{ applications, providers }} />
    </Flex>
  );
}
