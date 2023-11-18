import "resetize";
import "./global.css";

import { type Metadata, type Viewport } from "next";
import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: "Workoelho",
  description: "Software development operations, organized.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
