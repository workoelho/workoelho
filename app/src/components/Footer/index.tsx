import { ClassList } from "~/lib/client/ClassList";
import { Flex } from "~/components/Flex";

import classes from "./style.module.css";

type Props = {
  className?: string;
};

export function Footer({ className }: Props) {
  const classList = new ClassList(classes.footer, className);

  return (
    <footer className={classList.toString()}>
      <Flex style={{ gridColumn: 2 }} gap="3rem">
        <p>
          ©️ 2023 <a href="/">Workoelho</a>
        </p>

        <Flex as="ul" gap="1.5rem">
          <li>
            <a href="https://github.com/workoelho">GitHub</a>
          </li>
          <li>
            <a href="/changelog">What's new?</a>
          </li>
          <li>
            <a href="/privacy">Privacy policy</a>
          </li>
          <li>
            <a href="/help">Help</a>
          </li>
        </Flex>
      </Flex>

      <p className={classes.version}>v23.10.28-39dd4</p>
    </footer>
  );
}
