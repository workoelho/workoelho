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
import { formatDateTime } from "~/src/lib/shared/formatting";
import { getUrl } from "~/src/lib/shared/url";

export const metadata: Metadata = {
  title: "Applications at Workoelho",
};

type Props = {
  params: {
    organizationId: string;
  };
};

export default async function Page({ params: { organizationId } }: Props) {
  const session = await authorize({ organizationId });

  const applications = await api.application.list({
    payload: { page: 1 },
    session,
  });

  return (
    <Flex direction="column" gap="3rem">
      <Header
        title="Applications"
        description="Listing applications."
        right={
          <Flex as="menu">
            <li>
              <Button
                as={Link}
                href={getUrl(session.organization, "applications", "new")}
                shape="pill"
              >
                Add application <Icon variant="plus" />
              </Button>
            </li>
          </Flex>
        }
      />

      {applications.length > 0 ? (
        <Grid
          as="ul"
          template="auto / repeat(auto-fit, minmax(30%, 1fr))"
          gap=".375rem"
          justifyContent="center"
        >
          {applications.map((application) => (
            <li key={application.id}>
              <Link href={getUrl(session.organization, application)}>
                <Card>
                  <Entry variant="swap" label={application.name}>
                    {"Last updated at "}
                    {formatDateTime(application.updatedAt, {
                      dateStyle: "medium",
                    })}
                    .
                  </Entry>
                </Card>
              </Link>
            </li>
          ))}
        </Grid>
      ) : (
        <Flex justifyContent="center">
          <Empty size="large" title="No applications found." />
        </Flex>
      )}
    </Flex>
  );
}
