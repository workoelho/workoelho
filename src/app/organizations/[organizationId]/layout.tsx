import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import pkg from "~/package.json";
import { Brand } from "~/src/components/Brand";
import { Button } from "~/src/components/Button";
import { Container } from "~/src/components/Container";
import { Flex } from "~/src/components/Flex";
import { Grid } from "~/src/components/Grid";
import { Icon } from "~/src/components/Icon";
import { Menu, Option, Separator } from "~/src/components/Menu";
import { Popover } from "~/src/components/Popover";
import { Text } from "~/src/components/Text";
import * as api from "~/src/feats/api";
import { authorize } from "~/src/lib/server/authorization";
import { getDeviceId } from "~/src/lib/server/deviceId";
import { clearSessionCookie, setSessionCookie } from "~/src/lib/server/session";
import { UnauthorizedError } from "~/src/lib/shared/errors";
import { formatText } from "~/src/lib/shared/formatting";
import { getUrl } from "~/src/lib/shared/url";

type Props = {
  params: { organizationId: string };
  children: ReactNode;
};

export default async function Layout({ params, children }: Props) {
  const { organizationId } = params;

  const session = await authorize({ organizationId });

  const sessions = await api.session.listByDevice({
    payload: {
      deviceId: getDeviceId(cookies()),
    },
    session,
  });

  const signIn = async (sessionId: string) => {
    "use server";

    const session = await api.session.get({ payload: { id: sessionId } });

    if (!session) {
      throw new UnauthorizedError();
    }

    setSessionCookie(session);

    redirect(getUrl(session.organization, "summary"));
  };

  const signOut = async (sessionId: string) => {
    "use server";

    await api.session.invalidate({
      payload: { sessionId },
    });

    clearSessionCookie();

    redirect(getUrl("sign-in"));
  };

  return (
    <Grid template="5rem 1fr 5rem / 1fr" style={{ minHeight: "100vh" }}>
      <Grid
        as="nav"
        alignItems="center"
        template="auto / 1fr auto 1fr"
        style={{ paddingInline: "1.5rem" }}
      >
        <h1>
          <Link href="/">
            <Brand />
          </Link>
        </h1>

        <Flex as="ul" gap="1.5rem">
          <li>
            <Button
              as={Link}
              href={getUrl(session.organization, "summary")}
              shape="text"
            >
              Summary
            </Button>
          </li>
          <li>
            <Button
              as={Link}
              href={getUrl(session.organization, "activity")}
              shape="text"
            >
              Activity
            </Button>
          </li>
          <li>
            <Button
              as={Link}
              href={getUrl(session.organization, "applications")}
              shape="text"
            >
              Applications
            </Button>
          </li>
          <li>
            <Button
              as={Link}
              href={getUrl(session.organization, "users")}
              shape="text"
            >
              People
            </Button>
          </li>
          <li>
            <Button
              as={Link}
              href={getUrl(session.organization, "providers")}
              shape="text"
            >
              Providers
            </Button>
          </li>
          <li>
            <Button
              as={Link}
              href={getUrl(session.organization, "tags")}
              shape="text"
            >
              Tags
            </Button>
          </li>
        </Flex>

        <Flex as="ul" gap="1.5rem" style={{ justifySelf: "end" }}>
          <li>
            <Popover
              placement="right"
              trigger={
                <Button shape="text">
                  {formatText(session.user.name, { shortName: true })} (
                  {session.organization.name}
                  )
                  <Icon variant="chevron-down" />
                </Button>
              }
            >
              <Menu>
                <Option
                  as={Link}
                  href={getUrl(session.organization, "profile")}
                >
                  My profile
                </Option>
                <Option action={signOut.bind(null, session.id)}>
                  Sign out
                </Option>

                <Separator />

                {sessions.map((session) => (
                  <Option
                    key={session.id}
                    action={signIn.bind(null, session.id)}
                  >
                    <Flex direction="column">
                      {session.organization.name}
                      <Text variant="muted" size="smaller">
                        {session.user.email}
                      </Text>
                    </Flex>
                  </Option>
                ))}
                <Option as={Link} href={getUrl("sign-in")}>
                  Sign in
                </Option>
              </Menu>
            </Popover>
          </li>
        </Flex>
      </Grid>

      <main>{children}</main>

      <Grid
        as="footer"
        alignItems="center"
        template="auto / 1fr auto 1fr"
        style={{ paddingInline: "1.5rem" }}
      >
        <p>©️ 2023 Workoelho</p>

        <Flex as="nav" gap="1.5rem">
          <li>
            <Button as={Link} href="/changelog" shape="text">
              What's new?
            </Button>
          </li>
          <li>
            <Button as={Link} href="/help" shape="text">
              Help
            </Button>
          </li>
          <li>
            <Button as={Link} href="https://github.com/workoelho" shape="text">
              GitHub
            </Button>
          </li>
        </Flex>

        <p style={{ justifySelf: "end" }}>Version {pkg.version}</p>
      </Grid>
    </Grid>
  );
}
