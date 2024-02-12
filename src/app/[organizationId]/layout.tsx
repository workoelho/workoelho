import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { cookies } from "next/headers";

import pkg from "~/package.json";
import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { Footer } from "~/src/components/Footer";
import { Icon } from "~/src/components/Icon";
import { Menu } from "~/src/components/Menu";
import { Popover } from "~/src/components/Popover";
import { Topbar } from "~/src/components/Topbar";
import { clearSession } from "~/src/lib/server/session";
import { authorize } from "~/src/lib/server/authorization";
import { getShortName } from "~/src/lib/shared/api";
import { getPublicId } from "~/src/lib/shared/publicId";
import { db } from "~/src/lib/server/prisma";
import { getDeviceId } from "~/src/lib/server/device";

import classes from "./layout.module.css";

type Props = {
  params: { organizationId: string };
  children: ReactNode;
};

export default async function Layout({ params, children }: Props) {
  const { organizationId } = params;

  const session = await authorize({ organizationId });

  const sessions = await db.session.findMany({
    where: { deviceId: getDeviceId(cookies()), expiresAt: { gt: new Date() } },
    include: { user: { include: { organization: true } } },
  });

  const signOut = async () => {
    "use server";
    clearSession();
    redirect("/sign-in");
  };

  return (
    <div className={classes.layout}>
      <Topbar className={classes.topbar}>
        <Flex as="menu" gap="1.5rem" style={{ flexGrow: 1 }}>
          <li>
            <Button as="a" href={`/${organizationId}/summary`} shape="text">
              Summary
            </Button>
          </li>
          <li>
            <Button
              as="a"
              href={`/${organizationId}/applications`}
              shape="text"
            >
              Applications
            </Button>
          </li>
          <li>
            <Button as="a" href={`/${organizationId}/resources`} shape="text">
              Resources
            </Button>
          </li>
          <li>
            <Button as="a" href={`/${organizationId}/people`} shape="text">
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
              <Menu>
                {sessions.map((session) => (
                  <Menu.Item
                    key={session.id}
                    href={`/${getPublicId(session.user.organizationId)}/summary`}
                  >
                    {session.user.organization.name}
                  </Menu.Item>
                ))}

                <Menu.Separator />

                <Menu.Item>My profile</Menu.Item>
                <Menu.Item action={signOut}>Sign out</Menu.Item>
              </Menu>
            </Popover>
          </li>
        </Flex>
      </Topbar>

      <main className={classes.main}>{children}</main>

      <Footer className={classes.footer} version={pkg.version} />
    </div>
  );
}
