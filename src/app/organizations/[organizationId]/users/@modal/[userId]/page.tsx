import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";

import { list } from "~/src/actions/role";
import { get } from "~/src/actions/user/get";
import { Alert } from "~/src/components/Alert";
import { Button } from "~/src/components/Button";
import { Data } from "~/src/components/Data";
import { Flex } from "~/src/components/Flex";
import { Grid } from "~/src/components/Grid";
import { Heading } from "~/src/components/Heading";
import { Icon } from "~/src/components/Icon";
import { Modal } from "~/src/components/Modal";
import { authorize } from "~/src/lib/server/authorization";
import { NotFoundError } from "~/src/lib/shared/errors";
import { getPrivateId } from "~/src/lib/shared/publicId";
import { getUrl } from "~/src/lib/shared/url";

export const metadata: Metadata = {
  title: "Person at Workoelho",
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
        <Grid template="auto / 1fr auto 1fr" alignItems="center" gap="3rem">
          <div />

          <Heading as="h1" size="medium">
            Inspecting profile
          </Heading>

          <Flex as="menu" gap="0.5rem" style={{ justifySelf: "end" }}>
            <li>
              <Button as={Link} href={listingUrl} shape="text">
                <Icon variant="x" />
              </Button>
            </li>
          </Flex>
        </Grid>

        <Data>
          <Data.Entry label="Name">{user.name}</Data.Entry>
          <Data.Entry label="Email">{user.email}</Data.Entry>
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
