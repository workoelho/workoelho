import "./global.css";

import type { Metadata } from "next";
import { ReactNode } from "react";
import { Lato } from "next/font/google";

const font = Lato({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Workoelho",
  description: "Software development operations tamed.",
};

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
