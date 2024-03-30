import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { Header } from "~/src/components/Header";
import { Icon } from "~/src/components/Icon";
import * as api from "~/src/feats/api";
import { Form } from "~/src/feats/service/components/Form";
import { authorize } from "~/src/lib/server/authorization";
import { getFormProps } from "~/src/lib/shared/form";
import { getPublicId } from "~/src/lib/shared/publicId";
import { getUrl } from "~/src/lib/shared/url";

export const metadata: Metadata = {
  title: "Editing service at Workoelho",
};

type Props = {
  params: {
    organizationId: string;
    applicationId: string;
    serviceId: string;
  };
};

export default async function Page({
  params: { organizationId, applicationId, serviceId },
}: Props) {
  const session = await authorize({ organizationId });

  const application = await api.application.get({
    payload: { id: applicationId },
    session,
  });

  const service = await api.service.get({
    payload: { id: serviceId },
    session,
  });

  const applicationUrl = getUrl(session.organization, application);
  const listingUrl = getUrl(applicationUrl, "services");

  const form = getFormProps(
    async (state, payload) => {
      "use server";

      const session = await authorize({ organizationId });

      await api.service.update({
        payload: {
          id: serviceId,
          name: payload.get("name"),
          applicationId: payload.get("applicationId"),
          providerType: payload.get("providerType"),
          providerId: payload.get("providerId"),
        },
        session,
      });

      redirect(applicationUrl);
    },
    {
      values: {
        name: service.name,
        applicationId: getPublicId(service.application),
        providerType: service.providerType,
        providerId: getPublicId({
          $type: service.providerType,
          id: service.providerId,
        }),
      },
    },
  );

  const destroy = async () => {
    "use server";

    const session = await authorize({ organizationId });

    await api.service.destroy({
      payload: { id: serviceId },
      session,
    });

    redirect(applicationUrl);
  };

  return (
    <Flex direction="column" gap="3rem">
      <Header
        title={application.name}
        description="Editing service."
        right={
          <Flex as="menu">
            <li>
              <Button as={Link} href={listingUrl} shape="pill">
                <Icon variant="arrow-left" />
                Back
              </Button>
            </li>
          </Flex>
        }
      />

      <Form {...form} destroy={destroy} />
    </Flex>
  );
}
