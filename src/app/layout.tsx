import "./reset.css";
import "./global.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Libre_Franklin } from "next/font/google";

export const metadata: Metadata = {
  title: "Workoelho",
  description: "Web development operations, organized.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const font = Libre_Franklin({
  weight: ["400", "700", "900"],
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
