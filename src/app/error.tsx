"use client";

import Link from "next/link";

import { Brand } from "~/src/components/Brand";
import { Button } from "~/src/components/Button";
import { Container } from "~/src/components/Container";
import { Feedback } from "~/src/components/Feedback";
import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";

type Props = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  return (
    <Container padding="10% 1.5rem">
      <Feedback>
        <h1>
          <a href="/">
            <Brand size="large" />
          </a>
        </h1>

        <Heading as="h2" size="massive">
          Unexpected error.
        </Heading>

        <p style={{ maxWidth: "80ch", marginInline: "auto" }}>
          There was an error on our end and the request has failed. We're
          terribly sorry but would you mind trying again? In any case we've
          collected information about the error and will look into it soon.
        </p>

        <Flex as="menu" gap="0.5rem" justifyContent="center">
          <li>
            <Button onClick={() => reset()}>Try again</Button>
          </li>
          <li>
            <Button as={Link} href="/sign-in">
              Back
            </Button>
          </li>
        </Flex>
      </Feedback>
    </Container>
  );
}
