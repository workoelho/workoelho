import { ClassList } from "~/lib/client/ClassList";
import { Flex } from "~/components/Flex";
import { Button } from "~/components/Button";

import classes from "./style.module.css";

type Props = {
  className?: string;
};

export function Footer({ className }: Props) {
  const classList = new ClassList(classes.footer, className);

  return (
    <footer className={classList.toString()}>
      <div />

      <p>©️ 2023 Workoelho</p>

      <Flex as="ul" gap="1.5rem">
        <li>
          <Button as="a" shape="text" href="/">
            Workoelho
          </Button>
        </li>
        <li>
          <Button as="a" shape="text" href="/changelog">
            What's new?
          </Button>
        </li>
        <li>
          <Button as="a" shape="text" href="https://github.com/workoelho">
            GitHub
          </Button>
        </li>
        <li>
          <Button as="a" shape="text" href="/privacy">
            Privacy policy
          </Button>
        </li>
        <li>
          <Button as="a" shape="text" href="/help">
            Help
          </Button>
        </li>
      </Flex>

      <p className={classes.version}>v23.10.28-39dd4</p>
    </footer>
  );
}
