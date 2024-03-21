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
import { formatDateTime, formatText } from "~/src/lib/shared/formatting";
import { getPrivateId } from "~/src/lib/shared/publicId";
import { getUrl } from "~/src/lib/shared/url";

export const metadata: Metadata = {
  title: "Inspecting person at Workoelho",
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
    payload: { id: getPrivateId(userId) },
    session,
  });

  const listingUrl = getUrl(session.organization, "users");
  const userUrl = getUrl(listingUrl, userId);
  const editUrl = getUrl(userUrl, "edit");

  const roles = await api.role.list({
    payload: { userId: getPrivateId(userId), page: 1 },
    session,
  });

  return (
    <Modal closeUrl={listingUrl}>
      <Flex direction="column" gap="3rem">
        <Flex alignItems="center" justifyContent="space-between">
          <Heading as="h1" size="medium">
            Inspecting person
          </Heading>

          <Close />
        </Flex>

        <Flex direction="column" gap="1.5rem">
          <Flex alignItems="center" gap="1.5rem">
            <Heading as="h2" size="small">
              Summary
            </Heading>

            <Button as={Link} href={editUrl} fill="solid">
              Edit person <Icon variant="pencil" />
            </Button>
          </Flex>

          <Data>
            <Entry label="Created on">
              {formatDateTime(user.createdAt, {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </Entry>
            <Entry label="Updated on">
              {formatDateTime(user.updatedAt, {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </Entry>
            <Entry label="Name">{user.name}</Entry>
            <Entry label="Email">{user.email}</Entry>
            <Entry label="Level">
              {formatText(user.level, { titleCase: true })}
            </Entry>
          </Data>
        </Flex>

        <Flex direction="column" gap="1.5rem">
          <Flex alignItems="center" gap="1.5rem">
            <Heading as="h2" size="small">
              Roles
            </Heading>

            <Button
              as={Link}
              href={getUrl(userUrl, "roles", "new")}
              fill="solid"
            >
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
                  <Link href={getUrl(userUrl, role, "edit")}>
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
