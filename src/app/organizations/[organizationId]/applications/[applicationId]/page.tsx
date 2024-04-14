import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "~/src/components/Button";
import { Card } from "~/src/components/Card";
import { Container } from "~/src/components/Container";
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

  const application = await api.application.get({
    payload: { id: applicationId },
    session,
  });

  const relations = await api.relation.list({
    payload: { relator: { applicationId: applicationId }, page: 1 },
    session,
  });

  const roles = await api.role.list({
    payload: { applicationId, page: 1 },
    session,
  });

  const applicationUrl = getUrl(session.organization, application);
  const editUrl = getUrl(applicationUrl, "edit");

  return (
    <Flex direction="column" gap="3rem">
      <Header
        title={application.name}
        description="Inspecting application."
        right={
          <Flex as="menu">
            <li>
              <Button as={Link} href={editUrl} shape="pill">
                Edit application <Icon variant="pencil" />
              </Button>
            </li>
          </Flex>
        }
      />

      <Container
        padding=".375rem"
        style={{ borderRadius: ".625rem", backgroundColor: "var(--neutral-5)" }}
      >
        <Grid template="auto / repeat(2, 1fr)" gap="0.375rem">
          <Card negative>
            <Entry label="Created at">
              {formatDateTime(application.createdAt, {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </Entry>
          </Card>
          <Card negative>
            <Entry label="Updated at">
              {formatDateTime(application.updatedAt, {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </Entry>
          </Card>
          <Card negative>
            <Entry label="Name">{application.name}</Entry>
          </Card>
        </Grid>
      </Container>

      <Flex gap="3rem" justifyContent="space-between">
        <p>Listing application's relations.</p>

        <Flex as="menu">
          <li>
            <Button
              as={Link}
              href={getUrl(applicationUrl, "relations", "new")}
              shape="text"
            >
              Add relation <Icon variant="plus" />
            </Button>
          </li>
        </Flex>
      </Flex>

      {relations.length === 0 ? (
        <Empty title="No relations have been added." />
      ) : (
        <Grid
          as="ul"
          template="auto / repeat(auto-fit, minmax(30%, 1fr))"
          gap=".375rem"
          justifyContent="center"
        >
          {relations.map((relation) => (
            <li key={relation.id}>
              <Card>
                <Flex gap="0.75rem" justifyContent="space-between">
                  <Entry variant="swap" label={relation.name}>
                    {relation.relatable.application?.name ??
                      relation.relatable.provider?.name}
                  </Entry>
                  <Flex as="nav" gap="0.375rem">
                    <li>
                      <Button
                        as={Link}
                        variant="ghost"
                        href={getUrl(
                          session.organization,
                          relation.relatable.application ||
                            relation.relatable.provider
                        )}
                      >
                        <Icon
                          variant="looking-glass"
                          label="Inspect resource"
                        />
                      </Button>
                    </li>
                    <li>
                      <Button
                        as={Link}
                        variant="ghost"
                        href={getUrl(applicationUrl, relation, "edit")}
                      >
                        <Icon variant="pencil" label="Edit relation" />
                      </Button>
                    </li>
                  </Flex>
                </Flex>
              </Card>
            </li>
          ))}
        </Grid>
      )}

      <Flex gap="3rem" justifyContent="space-between">
        <p>Listing people's roles.</p>

        <Flex as="menu">
          <li>
            <Button
              as={Link}
              href={getUrl(applicationUrl, "roles", "new")}
              shape="text"
            >
              Add people <Icon variant="plus" />
            </Button>
          </li>
        </Flex>
      </Flex>

      {roles.length === 0 ? (
        <Empty title="Nobody has been assigned to this application." />
      ) : (
        <Grid
          as="ul"
          template="auto / repeat(auto-fit, minmax(30%, 1fr))"
          gap=".75rem"
          justifyContent="center"
        >
          {roles.map((role) => (
            <li key={role.id}>
              <Card>
                <Flex gap="0.75rem" justifyContent="space-between">
                  <Entry variant="swap" label={role.name}>
                    {role.user.name}
                  </Entry>
                  <Button as={Link} href={getUrl(applicationUrl, role, "edit")}>
                    <Icon variant="pencil" label="Edit role" />
                  </Button>
                </Flex>
              </Card>
            </li>
          ))}
        </Grid>
      )}
    </Flex>
  );
}
