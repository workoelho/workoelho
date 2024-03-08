import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { get } from "~/src/actions/user/get";
import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { authorize } from "~/src/lib/server/authorization";
import { getPrivateId } from "~/src/lib/shared/publicId";
import { getUrl } from "~/src/lib/shared/url";
import { getFormProps } from "~/src/lib/shared/form";
import { update } from "~/src/actions/user/update";
import { NotFoundError } from "~/src/lib/shared/errors";
import { Modal } from "~/src/components/Modal";
import { Button } from "~/src/components/Button";
import { Icon } from "~/src/components/Icon";
import { Grid } from "~/src/components/Grid";

import { Form } from "./form";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edit person at Workoelho",
};

type Props = {
  params: {
    organizationId: string;
    userId: string;
  };
};

export default async function Page({
  params: { organizationId, userId },
}: Props) {
  await authorize({ organizationId });

  const user = await get({ payload: { id: getPrivateId(userId) } });

  if (!user) {
    throw new NotFoundError();
  }

  const listingUrl = getUrl("organizations", organizationId, "users");
  const userUrl = getUrl(listingUrl, userId);

  const form = getFormProps(
    async (state, payload) => {
      "use server";

      await authorize({ organizationId });

      await update({
        payload: {
          id: getPrivateId(userId),
          name: payload.get("name"),
          email: payload.get("email"),
        },
      });

      redirect(userUrl);
    },
    { values: { name: user.name, email: user.email } }
  );

  return (
    <Modal closeUrl={listingUrl}>
      <Flex direction="column" gap="3rem">
        <Grid
          as="header"
          template="auto / 1fr auto 1fr"
          gap="3rem"
          alignItems="center"
        >
          <div />

          <Heading as="h1" size="medium">
            Editing person
          </Heading>

          <Flex as="menu" alignItems="center" style={{ justifySelf: "end" }}>
            <li>
              <Button as={Link} href={listingUrl} shape="text">
                <Icon variant="x" />
              </Button>
            </li>
          </Flex>
        </Grid>

        <Form {...form} cancelUrl={userUrl} />
      </Flex>
    </Modal>
  );
}
