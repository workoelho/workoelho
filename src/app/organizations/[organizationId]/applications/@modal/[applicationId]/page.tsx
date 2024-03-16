import type { Metadata } from "next";
import Link from "next/link";

import { list } from "~/src/actions/role";
import { get } from "~/src/actions/application/get";
import { Alert } from "~/src/components/Alert";
import { Button } from "~/src/components/Button";
import { Data, Entry } from "~/src/components/Data";
import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { Icon } from "~/src/components/Icon";
import { Close, Modal } from "~/src/components/Modal";
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
  const application = await get({
    payload: { id: getPrivateId(applicationId) },
    session,
  });

  const listingUrl = getUrl(session.organization, "applications");
  const applicationUrl = getUrl(listingUrl, applicationId);
  const editUrl = getUrl(applicationUrl, "edit");

  const roles = await list({
    payload: { applicationId: getPrivateId(applicationId), page: 1 },
    session,
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
              Inspecting application
            </Heading>

            <Flex as="menu" gap="0.5rem" alignItems="center">
              <li>
                <Button as={Link} href={editUrl}>
                  Edit application <Icon variant="pencil" />
                </Button>
              </li>
            </Flex>
          </Flex>

          <Close />
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

        <Flex direction="column" gap="1.5rem">
          <Flex gap="1.5rem">
            <Heading as="h2" size="medium">
              Roles
            </Heading>

            <Flex as="menu" gap="0.5rem" alignItems="center">
              <li>
                <Button as={Link} href={getUrl(applicationUrl, "roles", "new")}>
                  Add role <Icon variant="plus" />
                </Button>
              </li>
            </Flex>
          </Flex>

          {roles.length === 0 ? (
            <Alert variant="neutral">No roles.</Alert>
          ) : (
            <Data>
              {roles.map((role) => (
                <Entry key={role.id} label={role.name}>
                  {role.user.name}
                </Entry>
              ))}
            </Data>
          )}
        </Flex>
      </Flex>
    </Modal>
  );
}
