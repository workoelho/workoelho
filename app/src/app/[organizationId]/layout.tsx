import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

import pkg from "~/package.json";
import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { Footer } from "~/src/components/Footer";
import { Icon } from "~/src/components/Icon";
import { Menu } from "~/src/components/Menu";
import { Popover } from "~/src/components/Popover";
import { Topbar } from "~/src/components/Topbar";
import { getCurrentSession, hasMembershipTo } from "~/src/lib/server/session";
import { getShortName } from "~/src/lib/shared/api";
import { getPrivateId, getPublicId } from "~/src/lib/shared/publicId";

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
            <Button
              as="a"
              href={`/${publicOrganizationId}/summary`}
              shape="text"
            >
              Summary
            </Button>
          </li>
          <li>
            <Button
              as="a"
              href={`/${publicOrganizationId}/applications`}
              shape="text"
            >
              Applications
            </Button>
          </li>
          <li>
            <Button
              as="a"
              href={`/${publicOrganizationId}/resources`}
              shape="text"
            >
              Resources
            </Button>
          </li>
          <li>
            <Button
              as="a"
              href={`/${publicOrganizationId}/people`}
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
                  {session.user.memberships[0].organization.name})
                  <Icon name="chevron-down" />
                </Button>
              }
            >
              <Menu>
                {session.user.memberships.map((membership) => (
                  <Menu.Item
                    key={membership.organizationId}
                    href={`/${getPublicId(membership.organizationId)}/summary`}
                  >
                    {membership.organization.name}
                  </Menu.Item>
                ))}
                <Menu.Separator />
                <Menu.Item>My profile</Menu.Item>
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
