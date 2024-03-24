import type { ReactNode } from "react";

import { Flex } from "~/src/components/Flex";
import { Icon } from "~/src/components/Icon";
import * as api from "~/src/feats/api";
import { authorize } from "~/src/lib/server/authorization";
import { getPrivateId } from "~/src/lib/shared/publicId";
import { getUrl } from "~/src/lib/shared/url";
import { Tab } from "~/src/components/Tab";

type Props = {
  params: {
    organizationId: string;
    applicationId: string;
  };
  children: ReactNode;
};

export default async function Layout({ params, children }: Props) {
  const organizationId = getPrivateId(params.organizationId);
  const applicationId = getPrivateId(params.applicationId);

  const session = await authorize({ organizationId });

  const application = await api.application.get({
    payload: { id: applicationId },
    session,
  });

  const backUrl = getUrl(session.organization, "applications");
  const applicationUrl = getUrl(session.organization, application);
  const servicesUrl = getUrl(applicationUrl, "services");
  const rolesUrl = getUrl(applicationUrl, "roles");

  return (
    <Flex direction="column">
      <Flex as="menu" style={{ position: "absolute", top: 0 }}>
        <li>
          <Tab href={backUrl} exact>
            <Icon variant="arrow-left" />
          </Tab>
        </li>
        <li>
          <Tab href={applicationUrl} exact>
            Inspect
          </Tab>
        </li>
        <li>
          <Tab href={servicesUrl}>Services</Tab>
        </li>
        <li>
          <Tab href={rolesUrl}>People</Tab>
        </li>
      </Flex>

      {children}
    </Flex>
  );
}
