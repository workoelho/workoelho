import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "~/src/components/Button";
import { Card } from "~/src/components/Card";
import { Data, Entry } from "~/src/components/Data";
import { Empty } from "~/src/components/Empty";
import { Flex } from "~/src/components/Flex";
import { Grid } from "~/src/components/Grid";
import { Heading } from "~/src/components/Heading";
import { Icon } from "~/src/components/Icon";
import { Close, Modal } from "~/src/components/Modal";
import { Text } from "~/src/components/Text";
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

  const listingUrl = getUrl(session.organization, "applications");
  const applicationUrl = getUrl(listingUrl, applicationId);
  const editUrl = getUrl(applicationUrl, "edit");

  const roles = await api.role.list({
    payload: { applicationId: getPrivateId(applicationId), page: 1 },
    session,
  });

  return (
    <Modal closeUrl={listingUrl}>
      <Flex direction="column" gap="3rem">
        <Flex as="header" alignItems="center" justifyContent="space-between">
          <Heading as="h1" size="medium">
            Inspecting application
          </Heading>

          <Close />
        </Flex>

        <Flex direction="column" gap="1.5rem">
          <Flex gap="1.5rem">
            <Heading as="h1" size="small">
              Summary
            </Heading>

            <Button as={Link} href={editUrl}>
              Edit application <Icon variant="pencil" />
            </Button>
          </Flex>

          <Data>
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
          </Data>
        </Flex>

        <Flex direction="column" gap="1.5rem">
          <Flex gap="1.5rem">
            <Heading as="h2" size="small">
              People
            </Heading>

            <Button as={Link} href={getUrl(applicationUrl, "roles", "new")}>
              Add role <Icon variant="plus" />
            </Button>
          </Flex>

          {roles.length === 0 ? (
            <Empty title="No roles found." />
          ) : (
            <Grid
              as="li"
              template="auto / repeat(auto-fit, minmax(30%, 1fr))"
              gap=".75rem"
              justifyContent="center"
            >
              {roles.map((role) => (
                <li key={role.id}>
                  <Link href={getUrl(applicationUrl, role, "edit")}>
                    <Card as="article">
                      <Heading as="h1" size="tiny">
                        {role.user.name}
                      </Heading>
                      <Text variant="muted">{role.name}</Text>
                    </Card>
                  </Link>
                </li>
              ))}
            </Grid>
          )}
        </Flex>
      </Flex>
    </Modal>
  );
}
