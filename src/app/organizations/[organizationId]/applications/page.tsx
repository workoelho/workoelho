import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "~/src/components/Button";
import { Card } from "~/src/components/Card";
import { Container } from "~/src/components/Container";
import { Empty } from "~/src/components/Empty";
import { Flex } from "~/src/components/Flex";
import { Grid } from "~/src/components/Grid";
import { Header } from "~/src/components/Header";
import { Heading } from "~/src/components/Heading";
import { Icon } from "~/src/components/Icon";
import { Text } from "~/src/components/Text";
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
    <Container size="large" padding="3rem">
      <Flex direction="column" gap="3rem">
        <Header>
          <div />

          <Flex direction="column" alignItems="center" gap="0.5rem">
            <Heading as="h1" size="large">
              Applications
            </Heading>

            <p>Listing all applications.</p>
          </Flex>

          <Flex as="menu">
            <li>
              <Button
                as={Link}
                href={getUrl(session.organization, "applications", "new")}
              >
                Add application <Icon variant="plus" />
              </Button>
            </li>
          </Flex>
        </Header>

        <Grid
          as="ul"
          template="auto / repeat(auto-fit, minmax(30%, 1fr))"
          gap=".75rem"
          justifyContent="center"
        >
          {applications.length > 0 ? (
            applications.map((application) => (
              <li key={application.id}>
                <Link href={getUrl(session.organization, application)}>
                  <Card as="article">
                    <Heading as="h1" size="tiny">
                      {application.name}
                    </Heading>
                    <Text as="p" variant="muted">
                      {"Last updated at "}
                      {formatDateTime(application.updatedAt, {
                        dateStyle: "medium",
                      })}
                      .
                    </Text>
                  </Card>
                </Link>
              </li>
            ))
          ) : (
            <Flex justifyContent="center">
              <Empty size="large" title="No applications found." />
            </Flex>
          )}
        </Grid>
      </Flex>
    </Container>
  );
}
