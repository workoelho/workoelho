import type { ReactNode } from "react";

type Props = {
  params: {
    organizationId: string;
    applicationId: string;
  };
  children: ReactNode;
};

export default async function Layout({
  params: { organizationId, applicationId },
  children,
}: Props) {
  return children;
}
