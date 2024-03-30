import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "~/src/components/Button";
import { Card } from "~/src/components/Card";
import { Empty } from "~/src/components/Empty";
import { Entry } from "~/src/components/Entry";
import { Flex } from "~/src/components/Flex";
import { Grid } from "~/src/components/Grid";
import { Header } from "~/src/components/Header";
import { Icon } from "~/src/components/Icon";
import * as api from "~/src/feats/api";
import { authorize } from "~/src/lib/server/authorization";
import { formatText } from "~/src/lib/shared/formatting";
import { getUrl } from "~/src/lib/shared/url";

export const metadata: Metadata = {
  title: "User's roles at Workoelho",
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

  const roles = await api.role.list({
    payload: { userId, page: 1 },
    session,
  });

  const userUrl = getUrl(session.organization, user);

  return (
    <Flex direction="column" gap="3rem">
      <Header
        title={formatText(user.name, { shortName: true })}
        description="Listing user's roles."
        right={
          <Flex as="menu">
            <li>
              <Button
                as={Link}
                href={getUrl(userUrl, "roles", "new")}
                shape="pill"
              >
                Add role <Icon variant="plus" />
              </Button>
            </li>
          </Flex>
        }
      />

      {roles.length === 0 ? (
        <Flex justifyContent="center">
          <Empty title="No roles found." />
        </Flex>
      ) : (
        <Grid
          as="ul"
          template="auto / repeat(auto-fit, minmax(30%, 1fr))"
          gap=".75rem"
          justifyContent="center"
        >
          {roles.map((role) => (
            <li key={role.id}>
              <Link href={getUrl(userUrl, role, "edit")}>
                <Card>
                  <Entry label={role.application.name}>{role.name}</Entry>
                </Card>
              </Link>
            </li>
          ))}
        </Grid>
      )}
    </Flex>
  );
}
