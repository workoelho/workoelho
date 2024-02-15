import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { cookies } from "next/headers";

import pkg from "~/package.json";
import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { Footer } from "~/src/components/Footer";
import { Icon } from "~/src/components/Icon";
import { Popover } from "~/src/components/Popover";
import { Topbar } from "~/src/components/Topbar";
import { clearSession, setSession } from "~/src/lib/server/session";
import { authorize } from "~/src/lib/server/authorization";
import { getShortName } from "~/src/lib/shared/api";
import { getPublicId } from "~/src/lib/shared/publicId";
import { db } from "~/src/lib/server/prisma";
import { getDeviceId } from "~/src/lib/server/device";
import { UnauthorizedError } from "~/src/lib/shared/errors";

import { SessionMenu } from "./SessionMenu";
import classes from "./layout.module.css";

type Props = {
  params: { organizationId: string };
  children: ReactNode;
};

export default async function Layout({ params, children }: Props) {
  const { organizationId } = params;

  const session = await authorize({ organizationId });

  // Prisma doesn't support distinct on a related field.
  // We need a list of valid sessions, that originated from this device but unique for each organization.
  // The idea is to show a account switcher.
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

    setSession(session);

    redirect(
      `/organizations/${getPublicId(session.user.organizationId)}/summary`
    );
  };

  const signOut = async () => {
    "use server";

    await db.session.update({
      data: {
        expiresAt: new Date(),
      },
      where: { id: session.id },
    });

    clearSession();

    redirect("/sign-in");
  };

  return (
    <div className={classes.layout}>
      <Topbar className={classes.topbar}>
        <Flex as="menu" gap="1.5rem" style={{ flexGrow: 1 }}>
          <li>
            <Button
              as="a"
              href={`/organizations/${organizationId}/summary`}
              shape="text"
            >
              Summary
            </Button>
          </li>
          <li>
            <Button
              as="a"
              href={`/organizations/${organizationId}/activity`}
              shape="text"
            >
              Activity
            </Button>
          </li>
          <li>
            <Button
              as="a"
              href={`/organizations/${organizationId}/applications`}
              shape="text"
            >
              Applications
            </Button>
          </li>
          <li>
            <Button
              as="a"
              href={`/organizations/${organizationId}/providers`}
              shape="text"
            >
              Providers
            </Button>
          </li>
          <li>
            <Button
              as="a"
              href={`/organizations/${organizationId}/people`}
              shape="text"
            >
              People
            </Button>
          </li>
        </Flex>

        <Flex as="menu" gap="1.5rem">
          <li>
            <Popover
              placement="right"
              trigger={
                <Button shape="text">
                  {getShortName(session.user.name)} (
                  {session.user.organization.name})
                  <Icon name="chevron-down" />
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
