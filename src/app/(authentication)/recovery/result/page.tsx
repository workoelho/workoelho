import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "~/src/components/Button";
import { Feedback } from "~/src/components/Feedback";
import { Heading } from "~/src/components/Heading";

export const metadata: Metadata = {
  title: "Access recovery at Workoelho",
};

export default async function Page() {
  return (
    <Feedback>
      <Heading as="h1" size="massive">
        Message sent.
      </Heading>

      <p>Please check your email.</p>

      <menu>
        <li>
          <Button as={Link} href="/sign-in">
            Back
          </Button>
        </li>
      </menu>
    </Feedback>
  );
}
