import type { ReactNode } from "react";

import { Paper } from "~/src/components/Paper";

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  return <Paper>{children}</Paper>;
}
