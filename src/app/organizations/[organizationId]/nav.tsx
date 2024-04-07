"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { Icon } from "~/src/components/Icon";
import { getMappedModelUrl, getUrl } from "~/src/lib/shared/url";

function getModel(pathname: string) {
  const [type, publicId] = pathname.split("/").slice(3);

  if (!publicId) {
    return {};
  }

  return { publicId, $type: getMappedModelUrl(type) };
}

type Props = {
  session: {
    organization: string;
  };
};

export function Nav({ session }: Props) {
  const pathname = usePathname();
  const model = getModel(pathname);

  if (model.$type === "application") {
    const applicationUrl = getUrl(session.organization, model);
    const backUrl = getUrl(session.organization, "applications");
    const servicesUrl = getUrl(applicationUrl, "services");
    const rolesUrl = getUrl(applicationUrl, "roles");

    return (
      <Flex as="menu" gap="1.5rem" justifyContent="center">
        <li>
          <Button as={Link} href={backUrl} shape="text">
            <Icon variant="arrow-left" />
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

  if (model.$type === "user") {
    const userUrl = getUrl(session.organization, model);
    const backUrl = getUrl(session.organization, "users");
    const rolesUrl = getUrl(userUrl, "roles");

    return (
      <Flex as="menu" gap="1.5rem" justifyContent="center">
        <li>
          <Button as={Link} href={backUrl} shape="text">
            <Icon variant="arrow-left" />
          </Button>
        </li>
        <li>
          <Button as={Link} href={userUrl} shape="text">
            Inspect
          </Button>
        </li>
        <li>
          <Button as={Link} href={rolesUrl} shape="text">
            Roles
          </Button>
        </li>
      </Flex>
    );
  }

  return (
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
  );
}
