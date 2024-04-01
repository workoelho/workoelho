import Link from "next/link";

import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { Icon } from "~/src/components/Icon";
import { Application, Organization, Session } from "~/src/lib/server/prisma";
import { getUrl } from "~/src/lib/shared/url";

type Props = {
  session: Session & { organization: Organization };
  application: Application;
};

export function Menu({ session, application }: Props) {
  const applicationUrl = getUrl(session.organization, application);
  const backUrl = getUrl(session.organization, "applications");
  const servicesUrl = getUrl(applicationUrl, "services");
  const rolesUrl = getUrl(applicationUrl, "roles");

  return (
    <Flex as="menu" gap="1.5rem" justifyContent="center">
      <li>
        <Button as={Link} href={backUrl} shape="text">
          <Icon variant="arrow-left" /> Back
        </Button>
      </li>
      <li>
        <Button as={Link} href={applicationUrl} shape="text">
          Inspect
        </Button>
      </li>
      <li>
        <Button as={Link} href={servicesUrl} shape="text">
          Services
        </Button>
      </li>
      <li>
        <Button as={Link} href={rolesUrl} shape="text">
          People
        </Button>
      </li>
    </Flex>
  );
}
