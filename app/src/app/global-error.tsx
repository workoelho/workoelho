"use client";

import { redirect } from "next/navigation";

import { Button } from "~/src/components/Button";
import { Container } from "~/src/components/Container";
import { Feedback } from "~/src/components/Feedback";
import { Heading } from "~/src/components/Heading";

type Props = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  if (error.message === "Unauthenticated") {
    redirect("/sign-in");
  }

  return (
    <html lang="en">
      <body>
        <Container size="small" padding="1.5rem 10%">
          <Feedback>
            <Heading as="h1" size="massive">
              Error
            </Heading>
            <p>{error.message}</p>
            <menu>
              <li>
                <Button onClick={() => reset()}>Try again</Button>
              </li>
            </menu>
          </Feedback>
        </Container>
      </body>
    </html>
  );
}
