import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";

import { get } from "~/src/actions/user/get";
import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { authorize } from "~/src/lib/server/authorization";
import { getPrivateId } from "~/src/lib/shared/publicId";
import { getUrl } from "~/src/lib/shared/url";
import { NotFoundError } from "~/src/lib/shared/errors";
import { list } from "~/src/actions/role";
import { Alert } from "~/src/components/Alert";
import { Modal } from "~/src/components/Modal";
import { Icon } from "~/src/components/Icon";
import { Grid } from "~/src/components/Grid";

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

          <Flex direction="column" alignItems="center" gap="0.5rem">
            <Heading as="h1" size="large">
              Profile
            </Heading>
            <p>
              Last updated on {new Intl.DateTimeFormat().format(user.updatedAt)}
              .
            </p>
          </Flex>

          <Flex as="menu" gap="0.5rem">
            <li>
              <Button as={Link} href={editUrl}>
                Edit
              </Button>
            </li>
            <li>
              <Button as={Link} href={listingUrl}>
                Cancel
              </Button>
            </li>
          </Flex>
        </Grid>

        <dl>
          <dt>Name:</dt>
          <dd>{user.name}</dd>

          <dt>Email:</dt>
          <dd>{user.email}</dd>
        </dl>

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
