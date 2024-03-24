import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import pkg from "~/package.json";
import * as api from "~/src/feats/api";
import { authorize } from "~/src/lib/server/authorization";
import { UnauthorizedError } from "~/src/lib/shared/errors";
import { clearSessionCookie, setSessionCookie } from "~/src/lib/server/session";
import { formatText } from "~/src/lib/shared/formatting";
import { getDeviceId } from "~/src/lib/server/deviceId";
import { getUrl } from "~/src/lib/shared/url";
import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { Footer } from "~/src/components/Footer";
import { Grid } from "~/src/components/Grid";
import { Icon } from "~/src/components/Icon";
import { Menu, Option, Separator } from "~/src/components/Menu";
import { Popover } from "~/src/components/Popover";
import { Text } from "~/src/components/Text";
import { Topbar } from "~/src/components/Topbar";

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

  const swapCurrentSession = async (sessionId: string) => {
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
    <Grid template="auto 1fr auto / 1fr" style={{ height: "100vh" }}>
      <Topbar>
        <Flex as="menu" gap="1.5rem">
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

        <Flex as="menu" gap="1.5rem" style={{ justifySelf: "end" }}>
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
                    action={swapCurrentSession.bind(null, session.id)}
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
      </Topbar>

      <main>{children}</main>

      <Footer version={pkg.version} />
    </Grid>
  );
}
