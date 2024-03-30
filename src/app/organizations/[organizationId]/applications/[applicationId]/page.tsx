import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "~/src/components/Button";
import { Entry } from "~/src/components/Entry";
import { Flex } from "~/src/components/Flex";
import { Grid } from "~/src/components/Grid";
import { Header } from "~/src/components/Header";
import { Icon } from "~/src/components/Icon";
import * as api from "~/src/feats/api";
import { authorize } from "~/src/lib/server/authorization";
import { formatDateTime } from "~/src/lib/shared/formatting";
import { getUrl } from "~/src/lib/shared/url";

export const metadata: Metadata = {
  title: "Inspecting application at Workoelho",
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

  const applicationUrl = getUrl(session.organization, application);
  const editUrl = getUrl(applicationUrl, "edit");

  return (
    <Flex direction="column" gap="3rem">
      <Header
        title={application.name}
        description="Inspecting application."
        right={
          <Flex as="menu">
            <li>
              <Button as={Link} href={editUrl} shape="pill">
                Edit application <Icon variant="pencil" />
              </Button>
            </li>
          </Flex>
        }
      />

      <Grid template="auto / repeat(2, 1fr)" gap="0.75rem">
        <Entry label="Created at">
          {formatDateTime(application.createdAt, {
            dateStyle: "long",
            timeStyle: "short",
          })}
        </Entry>
        <Entry label="Updated at">
          {formatDateTime(application.updatedAt, {
            dateStyle: "long",
            timeStyle: "short",
          })}
        </Entry>
        <Entry label="Name">{application.name}</Entry>
      </Grid>
    </Flex>
  );
}