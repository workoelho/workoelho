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
      <ul className={classes.menu}>
        <li>
          <Button
            as="a"
            href="https://github.com/workoelho"
            shape="text"
            size="small"
          >
            GitHub
          </Button>
        </li>
        <li>
          <Button as="a" href="/changelog" shape="text" size="small">
            What's new?
          </Button>
        </li>
        <li>
          <Button as="a" href="/privacy" shape="text" size="small">
            Privacy policy
          </Button>
        </li>
        <li>
          <Button as="a" href="/help" shape="text" size="small">
            Help
          </Button>
        </li>
      </ul>

      <p className={classes.copyright}>
        ©️ 2023 Workoelho <span>v23.10.28-39dd4</span>
      </p>
    </footer>
  );
}
