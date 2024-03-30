import type { ReactNode } from "react";

import { Flex } from "~/src/components/Flex";
import { Icon } from "~/src/components/Icon";
import * as api from "~/src/feats/api";
import { authorize } from "~/src/lib/server/authorization";
import { getUrl } from "~/src/lib/shared/url";
import { Tab } from "~/src/components/Tab";

type Props = {
  params: {
    organizationId: string;
    userId: string;
  };
  children: ReactNode;
};

export default async function Layout({
  params: { organizationId, userId },
  children,
}: Props) {
  const session = await authorize({ organizationId });

  const user = await api.user.get({
    payload: { id: userId },
    session,
  });

  const backUrl = getUrl(session.organization, "users");
  const userUrl = getUrl(session.organization, user);
  const rolesUrl = getUrl(userUrl, "roles");

  return (
    <Flex direction="column">
      <Flex as="menu" style={{ position: "absolute", top: 0 }}>
        <li>
          <Tab href={backUrl} exact>
            <Icon variant="arrow-left" />
          </Tab>
        </li>
        <li>
          <Tab href={userUrl} exact>
            Inspect
          </Tab>
        </li>
        <li>
          <Tab href={rolesUrl}>Roles</Tab>
        </li>
      </Flex>

      {children}
    </Flex>
  );
}
