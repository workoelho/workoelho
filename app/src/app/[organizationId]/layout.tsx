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

import classes from "./layout.module.css";

type Props = {
  params: { organizationId: string };
  children: ReactNode;
};

export default async function Layout({ params, children }: Props) {
  const secret = cookies().get("session")?.value;
  const { organizationId } = params;
  const privateOrganizationId = getPrivateId(organizationId);

  const signOut = async () => {
    "use server";
    cookies().delete("session");
    redirect("/sign-in");
  };

  if (!secret) {
    redirect("/sign-in");
  }

  const session = await prisma.session.findUnique({
    where: { secret, expiresAt: { gt: new Date() } },
    include: {
      user: { include: { memberships: { include: { organization: true } } } },
    },
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (
    !session.user.memberships.some(
      (membership) => privateOrganizationId === membership.organizationId
    )
  ) {
    redirect("/sign-in");
  }

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
            <Button as="a" href={`/${organizationId}/activity`} shape="text">
              Activity
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
            <Button as="a" href={`/${organizationId}/technology`} shape="text">
              Technology
            </Button>
          </li>
          <li>
            <Button as="button" shape="text">
              More
              <Icon variant="triangle down" />
            </Button>
          </li>
          <li>
            <Button shape="pill" variant="primary">
              Quick add
            </Button>
          </li>
        </Flex>

        <Flex as="menu" gap="1.5rem">
          <li>
            <Popover
              placement="right"
              trigger={
                <Button shape="text" tabIndex={0}>
                  {session.user.name} (
                  {session.user.memberships[0].organization.name})
                  <Icon variant="triangle down" />
                </Button>
              }
            >
              <Box padding=".75rem">
                <Flex as="menu" direction="column">
                  <li>
                    <form action={signOut}>
                      <Button shape="text">Sign out</Button>
                    </form>
                  </li>
                </Flex>
              </Box>
            </Popover>
          </li>
        </Flex>
      </Topbar>

      <main className={classes.main}>{children}</main>

      <Footer className={classes.footer} version={pkg.version} />
    </div>
  );
}
