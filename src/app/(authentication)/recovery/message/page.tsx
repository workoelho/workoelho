import { Button } from "~/src/components/Button";
import { Feedback } from "~/src/components/Feedback";
import { Heading } from "~/src/components/Heading";

export default async function Page() {
  return (
    <Feedback>
      <Heading as="h1" size="massive">
        Recover started.
      </Heading>
      <p>Please check your e-mail.</p>
      <menu>
        <li>
          <Button as="a" href="/sign-in">
            Back
          </Button>
        </li>
      </menu>
    </Feedback>
  );
}
