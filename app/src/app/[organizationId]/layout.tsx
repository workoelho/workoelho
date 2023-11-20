import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

import pkg from "~/package.json";
import { Box } from "~/src/components/Box";
import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { Footer } from "~/src/components/Footer";
import { Icon } from "~/src/components/Icon";
import { Popover } from "~/src/components/Popover";
import { Topbar } from "~/src/components/Topbar";
import prisma from "~/src/lib/server/prisma";
import { getPrivateId } from "~/src/lib/shared/publicId";
import { getShortName } from "~/src/lib/shared/api";
import { Menu } from "~/src/components/Menu";
import {
  findValidSessionBySecret,
  getCurrentSession,
} from "~/src/lib/server/session";
import { hasMembershipTo } from "~/src/lib/server/action";

import classes from "./layout.module.css";

type Props = {
  params: { organizationId: string };
  children: ReactNode;
};

export default async function Layout({ params, children }: Props) {
  const { organizationId: publicOrganizationId } = params;
  const organizationId = getPrivateId(publicOrganizationId);

  const session = await getCurrentSession();

  if (!session) {
    throw new Error("Unauthenticated");
  }

  if (!hasMembershipTo(session, organizationId)) {
    throw new Error("Unauthorized");
  }

  const signOut = async () => {
    "use server";
    cookies().delete("session");
    redirect("/sign-in");
  };

  return (
    <div className={classes.layout}>
      <Topbar className={classes.topbar}>
        <Flex as="menu" gap="1.5rem" style={{ flexGrow: 1 }}>
          <li>
            <Button as="a" href={`/${publicOrganizationId}/summary`}>
              Summary
            </Button>
          </li>
          <li>
            <Button as="a" href={`/${publicOrganizationId}/activity`}>
              Activity
            </Button>
          </li>
          <li>
            <Button as="a" href={`/${publicOrganizationId}/tags`}>
              Tags
            </Button>
          </li>
          <li>
            <Button as="a" href={`/${publicOrganizationId}/applications`}>
              Applications
            </Button>
          </li>
          <li>
            <Popover
              trigger={
                <Button as="button">
                  More
                  <Icon name="chevron/down" />
                </Button>
              }
            >
              <Menu>
                <Menu.Item href={`/${publicOrganizationId}/technology`}>
                  Technology
                </Menu.Item>
                <Menu.Item href={`/${publicOrganizationId}/providers`}>
                  Providers
                </Menu.Item>
                <Menu.Item href={`/${publicOrganizationId}/people`}>
                  People
                </Menu.Item>
              </Menu>
            </Popover>
          </li>
        </Flex>

        <Flex as="menu" gap="1.5rem">
          <li>
            <Popover
              placement="right"
              trigger={
                <Button>
                  {getShortName(session.user.name)} (
                  {session.user.memberships[0].organization.name})
                  <Icon name="chevron/down" />
                </Button>
              }
            >
              <Menu>
                <Menu.Item>Workoelho</Menu.Item>
                <Menu.Item>Corenzan</Menu.Item>
                <Menu.Item>JogaJunto</Menu.Item>
                <Menu.Separator />
                <form action={signOut}>
                  <Menu.Item>Sign out</Menu.Item>
                </form>
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
