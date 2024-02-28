import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "People at Workoelho",
};

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return children;
}
