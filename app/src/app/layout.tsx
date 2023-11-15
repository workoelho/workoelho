import "./reset.css";
import "./global.css";

import { type Viewport, type Metadata } from "next";
import { Arimo } from "next/font/google";
import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: "Workoelho",
  description: "Software development operations, tamed.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const font = Arimo({
  weight: ["400", "500", "700"],
  style: ["normal"],
  display: "swap",
  subsets: ["latin"],
});

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <html lang="en" style={font.style}>
      <style></style>
      <body>{children}</body>
    </html>
  );
}
