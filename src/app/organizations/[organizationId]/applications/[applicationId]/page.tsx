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
import { getPrivateId } from "~/src/lib/shared/publicId";
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
    payload: { id: getPrivateId(applicationId) },
    session,
  });

  const services = await api.service.list({
    payload: { applicationId: getPrivateId(applicationId), page: 1 },
    session,
  });

  const roles = await api.role.list({
    payload: { applicationId: getPrivateId(applicationId), page: 1 },
    session,
  });

  const listingUrl = getUrl(session.organization, "applications");
  const applicationUrl = getUrl(listingUrl, applicationId);
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

      <Flex direction="column" gap="1.5rem">
        <Grid template="auto / repeat(2, 1fr)" gap="0.75rem">
          <Entry label="Created on">
            {formatDateTime(application.createdAt, {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </Entry>
          <Entry label="Updated on">
            {formatDateTime(application.updatedAt, {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </Entry>
          <Entry label="Name">{application.name}</Entry>
        </Grid>
      </Flex>
    </Flex>
  );
}
