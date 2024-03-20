import type { Metadata } from "next";
import Link from "next/link";

import * as Roles from "~/src/feats/roles/api";
import * as Users from "~/src/feats/users/api";
import { Alert } from "~/src/components/Alert";
import { Button } from "~/src/components/Button";
import { Data, Entry } from "~/src/components/Data";
import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { Icon } from "~/src/components/Icon";
import { Close, Modal } from "~/src/components/Modal";
import { authorize } from "~/src/lib/server/authorization";
import { formatDateTime, formatText } from "~/src/lib/shared/formatting";
import { getPrivateId } from "~/src/lib/shared/publicId";
import { getUrl } from "~/src/lib/shared/url";
import { Empty } from "~/src/components/Empty";
import { Header } from "~/src/components/Header";

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
  const user = await Users.get({
    payload: { id: getPrivateId(userId) },
    session,
  });

  const listingUrl = getUrl(session.organization, "users");
  const userUrl = getUrl(listingUrl, userId);
  const editUrl = getUrl(userUrl, "edit");

  const roles = await Roles.list({
    payload: { userId: getPrivateId(userId), page: 1 },
    session,
  });

  return (
    <Modal closeUrl={listingUrl}>
      <Flex direction="column" gap="3rem">
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" gap="3rem">
            <Heading as="h1" size="medium">
              Inspecting person
            </Heading>

            <Button as={Link} href={editUrl}>
              Edit person <Icon variant="pencil" />
            </Button>
          </Flex>

          <Close />
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

        <Flex direction="column" gap="1.5rem">
          <Flex alignItems="center" gap="3rem">
            <Heading as="h1" size="medium">
              Roles
            </Heading>

            <Button as={Link} href={getUrl(userUrl, "roles", "new")}>
              Add role <Icon variant="plus" />
            </Button>
          </Flex>

          {roles.length === 0 ? (
            <Empty title="No roles found." />
          ) : (
            <Data>
              {roles.map((role) => (
                <Entry key={role.id} label={role.application.name}>
                  {role.name}
                </Entry>
              ))}
            </Data>
          )}
        </Flex>
      </Flex>
    </Modal>
  );
}
