import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { Footer } from "~/src/components/Footer";
import { Icon } from "~/src/components/Icon";
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
  const publicOrganizationId = params.organizationId;
  const privateOrganizationId = getPrivateId(publicOrganizationId);

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
      (membership) => privateOrganizationId === membership.organizationId,
    )
  ) {
    redirect("/sign-in");
  }

  const {
    user,
    user: {
      memberships: [{ organization }],
    },
  } = session;

  return (
    <div className={classes.layout}>
      <Topbar className={classes.topbar}>
        <Flex as="ul" gap="1.5rem" style={{ flexGrow: 1 }}>
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
              href={`/${publicOrganizationId}/activity`}
              shape="text"
            >
              Activity
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
              href={`/${publicOrganizationId}/technology`}
              shape="text"
            >
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

        <Flex as="ul" gap="1.5rem">
          <li>
            <Button shape="text">
              {user.name} ({organization.name})
              <Icon variant="triangle down" />
            </Button>
          </li>
        </Flex>
      </Topbar>

      <main className={classes.main}>{children}</main>

      <Footer className={classes.footer} />
    </div>
  );
}
