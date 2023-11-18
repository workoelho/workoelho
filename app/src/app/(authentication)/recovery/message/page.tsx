import { Button } from "~/src/components/Button";
import { Feedback } from "~/src/components/Feedback";
import { Heading } from "~/src/components/Heading";

export function Page() {
  return (
    <Feedback>
      <Heading as="h1" size="massive">
        Recover started.
      </Heading>
      <p>Please check your e-mail.</p>
      <Button as="a" href="/sign-in">
        Back
      </Button>
    </Feedback>
  );
}
