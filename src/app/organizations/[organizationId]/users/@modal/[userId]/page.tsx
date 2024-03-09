import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";

import { list } from "~/src/actions/role";
import { get } from "~/src/actions/user/get";
import { Alert } from "~/src/components/Alert";
import { Button } from "~/src/components/Button";
import { Data, Entry } from "~/src/components/Data";
import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { Icon } from "~/src/components/Icon";
import { Close, Modal } from "~/src/components/Modal";
import { authorize } from "~/src/lib/server/authorization";
import { NotFoundError } from "~/src/lib/shared/errors";
import { format } from "~/src/lib/shared/formatting";
import { getPrivateId } from "~/src/lib/shared/publicId";
import { getUrl } from "~/src/lib/shared/url";

export const metadata: Metadata = {
  title: "Inspecting profile at Workoelho",
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
  await authorize({ organizationId });

  const user = await get({ payload: { id: getPrivateId(userId) } });

  if (!user) {
    throw new NotFoundError();
  }

  const listingUrl = getUrl("organizations", organizationId, "users");
  const editUrl = getUrl(listingUrl, userId, "edit");

  const roles = await list({
    payload: { userId: getPrivateId(userId), page: 1 },
  });

  return (
    <Modal closeUrl={listingUrl}>
      <Flex direction="column" gap="3rem">
        <Flex
          as="header"
          alignItems="center"
          justifyContent="space-between"
          style={{ height: "1.5rem" }}
        >
          <Flex gap="1.5rem">
            <Heading as="h1" size="medium">
              Inspecting profile
            </Heading>

            <Flex as="menu" gap="0.5rem" alignItems="center">
              <li>
                <Button as={Link} href={editUrl}>
                  Edit <Icon variant="pencil" />
                </Button>
              </li>
            </Flex>
          </Flex>

          <Close />
        </Flex>

        <Data>
          <Entry label="Created on">
            {format(user.createdAt, undefined, {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </Entry>
          <Entry label="Updated on">
            {format(user.updatedAt, undefined, {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </Entry>
          <Entry label="Name">{user.name}</Entry>
          <Entry label="Email" copiable>
            {user.email}
          </Entry>
        </Data>

        <Flex direction="column" gap="1.5rem">
          <Heading as="h2" size="medium">
            Roles
          </Heading>

          {roles.length === 0 ? (
            <Alert variant="neutral">No roles.</Alert>
          ) : (
            <dl>
              {roles.map((role) => (
                <Fragment key={role.id}>
                  <dt>{role.application.name}</dt>
                  <dd>{role.name}</dd>
                </Fragment>
              ))}
            </dl>
          )}
        </Flex>
      </Flex>
    </Modal>
  );
}
