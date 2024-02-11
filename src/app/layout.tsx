import "resetize";
import "./global.css";

import { type Metadata, type Viewport } from "next";
import { Open_Sans } from "next/font/google";
import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: "Workoelho",
  description: "Software development operations, organized.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// @todo This seems to fix an issue with reloading during
// development, but it probably should be removed.
// export const dynamic = "force-dynamic";
// export const revalidate = 0;

const font = Open_Sans({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin-ext"],
  display: "swap",
});

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
