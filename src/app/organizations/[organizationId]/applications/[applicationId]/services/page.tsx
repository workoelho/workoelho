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
  title: "Application's services at Workoelho",
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

  const application = await api.application.get({
    payload: { id: applicationId },
    session,
  });

  const services = await api.service.list({
    payload: { applicationId: applicationId, page: 1 },
    session,
  });

  const applicationUrl = getUrl(session.organization, application);

  return (
    <Flex direction="column" gap="3rem">
      <Header
        title={application.name}
        description="Listing application's services."
        right={
          <Flex as="menu">
            <li>
              <Button
                as={Link}
                href={getUrl(applicationUrl, "services", "new")}
                shape="pill"
              >
                Add service <Icon variant="plus" />
              </Button>
            </li>
          </Flex>
        }
      />

      {services.length === 0 ? (
        <Flex justifyContent="center">
          <Empty title="No services found." />
        </Flex>
      ) : (
        <Grid
          as="ul"
          template="auto / repeat(auto-fit, minmax(30%, 1fr))"
          gap=".75rem"
          justifyContent="center"
        >
          {services.map((service) => (
            <li key={service.id}>
              <Link href={getUrl(applicationUrl, service, "edit")}>
                <Card>
                  <Entry variant="swap" label={service.name}>
                    {service.providerType}-{service.providerId}
                  </Entry>
                </Card>
              </Link>
            </li>
          ))}
        </Grid>
      )}
    </Flex>
  );
}
