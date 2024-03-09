import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

import pkg from "~/package.json";
import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { Footer } from "~/src/components/Footer";
import { Icon } from "~/src/components/Icon";
import { Popover } from "~/src/components/Popover";
import { Topbar } from "~/src/components/Topbar";
import { clearSessionCookie, setSessionCookie } from "~/src/lib/server/session";
import { authorize } from "~/src/lib/server/authorization";
import { getShortName } from "~/src/lib/shared/api";
import { db } from "~/src/lib/server/prisma";
import { getDeviceId } from "~/src/lib/server/deviceId";
import { UnauthorizedError } from "~/src/lib/shared/errors";
import { getUrl } from "~/src/lib/shared/url";

import classes from "./layout.module.css";
import { SessionMenu } from "./SessionMenu";

type Props = {
  params: { organizationId: string };
  children: ReactNode;
};

export default async function Layout({ params, children }: Props) {
  const { organizationId } = params;

  const session = await authorize({ organizationId });

  // Prisma doesn't support distinct on a related field, but we need a list of valid sessions,
  // that originated from this device that are distinct for each organization.
  //
  // The goal is to display an account switcher.
  const sessions = (
    await db.session.findMany({
      where: {
        deviceId: getDeviceId(cookies()),
        expiresAt: { gt: new Date() },
      },
      include: { user: { include: { organization: true } } },
      orderBy: { createdAt: "desc" },
    })
  ).reduce(
    (sessions, session) => {
      if (
        sessions.some(
          ({ organizationId }) => organizationId === session.user.organizationId
        )
      ) {
        return sessions;
      }
      return [
        ...sessions,
        {
          organizationId: session.user.organizationId,
          name: `${getShortName(session.user.name)} (${session.user.organization.name})`,
          id: session.id,
        },
      ];
    },
    [] as { id: string; name: string; organizationId: number }[]
  );

  const signIn = async (sessionId: string) => {
    "use server";

    const session = await db.session.findUnique({
      where: { id: sessionId, expiresAt: { gt: new Date() } },
      include: { user: true },
    });

    if (!session) {
      throw new UnauthorizedError();
    }

    setSessionCookie(session);

    redirect(getUrl("organizations", session.user.organizationId, "summary"));
  };

  const signOut = async () => {
    "use server";

    await db.session.update({
      data: {
        expiresAt: new Date(),
      },
      where: { id: session.id },
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
              href={getUrl("organizations", organizationId, "summary")}
              shape="text"
            >
              Summary
            </Button>
          </li>
          <li>
            <Button
              as={Link}
              href={getUrl("organizations", organizationId, "activity")}
              shape="text"
            >
              Activity
            </Button>
          </li>
          <li>
            <Button
              as={Link}
              href={getUrl("organizations", organizationId, "applications")}
              shape="text"
            >
              Applications
            </Button>
          </li>
          <li>
            <Button
              as={Link}
              href={getUrl("organizations", organizationId, "services")}
              shape="text"
            >
              Services
            </Button>
          </li>
          <li>
            <Button
              as={Link}
              href={getUrl("organizations", organizationId, "users")}
              shape="text"
            >
              People
            </Button>
          </li>
          <li>
            <Button
              as={Link}
              href={getUrl("organizations", organizationId, "providers")}
              shape="text"
            >
              Providers
            </Button>
          </li>
          <li>
            <Button
              as={Link}
              href={getUrl("organizations", organizationId, "tags")}
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
                  {getShortName(session.user.name)} (
                  {session.user.organization.name})
                  <Icon variant="chevron-down" />
                </Button>
              }
            >
              <SessionMenu
                signIn={signIn}
                signOut={signOut}
                sessions={sessions}
              />
            </Popover>
          </li>
        </Flex>
      </Topbar>

      <main className={classes.main}>{children}</main>

      <Footer className={classes.footer} version={pkg.version} />
    </div>
  );
}
