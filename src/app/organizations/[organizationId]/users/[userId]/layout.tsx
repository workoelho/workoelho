import type { ReactNode } from "react";

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
  return children;
}
