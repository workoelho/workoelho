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
import { getPrivateId } from "~/src/lib/shared/publicId";
import { getUrl } from "~/src/lib/shared/url";

export const metadata: Metadata = {
  title: "Application's people at Workoelho",
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
    payload: { id: getPrivateId(applicationId) },
    session,
  });

  const roles = await api.role.list({
    payload: { applicationId: getPrivateId(applicationId), page: 1 },
    session,
  });

  const listingUrl = getUrl(session.organization, "applications");
  const applicationUrl = getUrl(listingUrl, applicationId);

  return (
    <Flex direction="column" gap="3rem">
      <Header
        title={application.name}
        description="Listing application's people."
        right={
          <Flex as="menu">
            <li>
              <Button
                as={Link}
                href={getUrl(applicationUrl, "roles", "new")}
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
          <Empty title="No people found." />
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
              <Link href={getUrl(applicationUrl, role, "edit")}>
                <Card>
                  <Entry variant="swap" label={role.name}>
                    {role.user.name}
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
