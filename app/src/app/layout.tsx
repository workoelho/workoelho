import "./reset.css";
import "./global.css";

import { type Viewport, type Metadata } from "next";
import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: "Workoelho",
  description: "Software development operations tamed.",
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
