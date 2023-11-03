import { Flex } from "~/components/Flex";
import { Heading } from "~/components/Heading";
import { Grid } from "~/components/Grid";
import { Button } from "~/components/Button";

import classes from "./page.module.css";

export default function Page() {
  return (
    <div className={classes.layout}>
      <Flex as="header" id="introduction" direction="column" gap="3rem">
        <Heading as="h1" size="massive">
          Software development operations, tamed.
        </Heading>

        <Flex direction="column" gap="1.5rem">
          <p style={{ fontSize: "1.25rem" }}>
            <strong>Workoelho</strong> is an open source knowledge base hub for
            software development teams.
          </p>

          <Flex as="ul" gap=".75rem">
            <li>
              <Button as="a" href="/pricing" size="large" variant="primary">
                Try it, free
              </Button>
            </li>
            <li>
              <Button as="a" href="#features" size="large">
                Read on
              </Button>
            </li>
          </Flex>
        </Flex>
      </Flex>

      <Flex as="section" id="features" direction="column" gap="3rem">
        <a href="#features">
          <Heading as="h2" size="large">
            What can it do?
          </Heading>
        </a>

        <Grid template="auto auto / 1fr 1fr" as="ul" gap="1.5rem 3rem">
          <Flex as="li" direction="column" gap="0.75rem">
            <Heading as="h3" size="medium">
              Document
            </Heading>

            <p>
              Record all the components of your operations, including projects,
              applications, technologies, service providers, code repositories,
              people's roles, and more.
            </p>
          </Flex>
          <Flex as="li" direction="column" gap="0.75rem">
            <Heading as="h3" size="medium">
              Describe
            </Heading>

            <p>
              Enrich your records by adding details, writing documentation,
              assigning roles, and more to have an extensive and robust
              knowledge base.
            </p>
          </Flex>
          <Flex as="li" direction="column" gap="0.75rem">
            <Heading as="h3" size="medium">
              Relate
            </Heading>

            <p>
              Establish relationships, declare dependencies, connect to external
              services, and tag everything to better understand and organize
              your data.
            </p>
          </Flex>
          <Flex as="li" direction="column" gap="0.75rem">
            <Heading as="h3" size="medium">
              Track
            </Heading>

            <p>
              Monitor activity, track changes, and gain insights through graphs,
              charts and other visual representation to help you make informed
              decisions and follow progress.
            </p>
          </Flex>
          <Flex as="li" direction="column" gap="0.75rem">
            <Heading as="h3" size="medium">
              Open source and freedom
            </Heading>

            <p>
              Workoelho is open source, which means you can run it on your own
              infrastructure. But even in the managed version you own your data
              and can export all of it at any time.
            </p>
          </Flex>
        </Grid>
      </Flex>

      <Flex as="section" id="cases" direction="column" gap="3rem">
        <a href="#cases">
          <Heading as="h2" size="large">
            What is it for?
          </Heading>
        </a>

        <Grid template="auto auto / 1fr 1fr" as="ul" gap="1.5rem 3rem">
          <Flex as="li" direction="column" gap="0.75rem">
            <Heading as="h3" size="medium">
              Centralizing
            </Heading>

            <p>
              All-in-ones may sound great but are usually bloated with features
              you end up not using. By taking a different approach Workoelho
              centralizes without replacing any of your favorite tools.
            </p>
          </Flex>
          <Flex as="li" direction="column" gap="0.75rem">
            <Heading as="h3" size="medium">
              Organizing
            </Heading>

            <p>
              Having everything in one place make it so much easier to find the
              information you're looking for and to keep everything up to date.
            </p>
          </Flex>
          <Flex as="li" direction="column" gap="0.75rem">
            <Heading as="h3" size="medium">
              Onboarding
            </Heading>

            <p>
              Overloading new teammates with excessive information in a single
              meeting can be frustrating. Workoelho allows them to explore at
              their own pace, find information when needed and even contribute
              back in record time.
            </p>
          </Flex>
          <Flex as="li" direction="column" gap="0.75rem">
            <Heading as="h3" size="medium">
              Resource management
            </Heading>

            <p>
              An overview of the services and technologies used in each of your
              projects helps you to better manage your resources, during hiring,
              selecting providers, and more.
            </p>
          </Flex>
        </Grid>
      </Flex>

      <Flex
        as="section"
        direction="column"
        alignItems="center"
        gap="1.5rem"
        style={{
          gridColumn: "1 / span 3",
          backgroundColor: "var(--background-2)",
        }}
      >
        <Heading as="p" size="small">
          Never get lost again.
        </Heading>

        <Button as="a" href="/pricing" size="large" variant="primary">
          Try it, free
        </Button>
      </Flex>
    </div>
  );
}
