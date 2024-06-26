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
import { getUrl } from "~/src/lib/shared/url";

export const metadata: Metadata = {
  title: "People at Workoelho",
};

type Props = {
  params: {
    organizationId: string;
  };
};

export default async function Page({ params: { organizationId } }: Props) {
  const session = await authorize({ organizationId });

  const users = await api.user.list({
    payload: { page: 1 },
    session,
  });

  return (
    <Flex direction="column" gap="3rem">
      <Header
        title="People"
        description="Listing people."
        right={
          <Flex as="menu">
            <li>
              <Button
                as={Link}
                href={getUrl(session.organization, "users", "new")}
                shape="pill"
              >
                Add user <Icon variant="plus" />
              </Button>
            </li>
          </Flex>
        }
      />

      {users.length > 0 ? (
        <Grid
          as="ul"
          template="auto / repeat(auto-fit, minmax(30%, 1fr))"
          gap=".75rem"
          justifyContent="center"
        >
          {users.map((user) => (
            <li key={user.id}>
              <Link href={getUrl(session.organization, user)}>
                <Card>
                  <Entry variant="swap" label={user.name}>
                    {user.email}
                  </Entry>
                </Card>
              </Link>
            </li>
          ))}
        </Grid>
      ) : (
        <Flex justifyContent="center">
          <Empty size="large" title="No people found." />
        </Flex>
      )}
    </Flex>
  );
}
