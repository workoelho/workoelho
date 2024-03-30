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
import { formatDateTime, formatText } from "~/src/lib/shared/formatting";
import { getUrl } from "~/src/lib/shared/url";

export const metadata: Metadata = {
  title: "Inspecting user at Workoelho",
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
    payload: { id: userId },
    session,
  });

  const userUrl = getUrl(session.organization, user);
  const editUrl = getUrl(userUrl, "edit");

  return (
    <Flex direction="column" gap="3rem">
      <Header
        title={formatText(user.name, { shortName: true })}
        description="Inspecting user."
        right={
          <Flex as="menu">
            <li>
              <Button as={Link} href={editUrl} shape="pill">
                Edit user <Icon variant="pencil" />
              </Button>
            </li>
          </Flex>
        }
      />

      <Grid template="auto / repeat(2, 1fr)" gap="0.75rem">
        <Entry label="Created at">
          {formatDateTime(user.createdAt, {
            dateStyle: "long",
            timeStyle: "short",
          })}
        </Entry>
        <Entry label="Updated at">
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
      </Grid>
    </Flex>
  );
}
