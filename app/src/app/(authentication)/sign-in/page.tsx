import { redirect } from "next/navigation";
import { type Metadata } from "next";
import { cookies } from "next/headers";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "Sign in at Workoelho",
};

export default function Page() {
  return <Form />;
}
