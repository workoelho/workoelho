import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

import pkg from "~/package.json";
import * as Sessions from "~/src/feats/sessions/api";
import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { Footer } from "~/src/components/Footer";
import { Icon } from "~/src/components/Icon";
import { Popover } from "~/src/components/Popover";
import { Topbar } from "~/src/components/Topbar";
import { clearSessionCookie, setSessionCookie } from "~/src/lib/server/session";
import { authorize } from "~/src/lib/server/authorization";
import { getShortName } from "~/src/lib/shared/api";
import { getDeviceId } from "~/src/lib/server/deviceId";
import { UnauthorizedError } from "~/src/lib/shared/errors";
import { getUrl } from "~/src/lib/shared/url";
import { Menu, Option, Separator } from "~/src/components/Menu";
import { Text } from "~/src/components/Text";

import classes from "./layout.module.css";

type Props = {
  params: { organizationId: string };
  children: ReactNode;
  modal: ReactNode;
};

export default async function Layout({ params, children, modal }: Props) {
  const { organizationId } = params;

  const session = await authorize({ organizationId });

  const sessions = await Sessions.listByDevice({
    payload: {
      deviceId: getDeviceId(cookies()),
    },
    session,
  });

  const switchSession = async (sessionId: string) => {
    "use server";

    const session = await Sessions.get({ payload: { id: sessionId } });

    if (!session) {
      throw new UnauthorizedError();
    }

    setSessionCookie(session);

    redirect(getUrl(session.organization, "summary"));
  };

  const signOut = async (sessionId: string) => {
    "use server";

    await Sessions.invalidate({
      payload: { sessionId },
    });

    clearSessionCookie();

    redirect(getUrl("sign-in"));
  };

  return (
    <div className={classes.layout}>
      <Topbar className={classes.topbar}>
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
              href={getUrl(session.organization, "services")}
              shape="text"
            >
              Services
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
                  {getShortName(session.user.name)} ({session.organization.name}
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
                    action={switchSession.bind(null, session.id)}
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

      <main className={classes.main}>
        {children}
        {modal}
      </main>

      <Footer className={classes.footer} version={pkg.version} />
    </div>
  );
}
