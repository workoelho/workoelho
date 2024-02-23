import { Button } from "~/src/components/Button";
import { ClassList } from "~/src/lib/shared/ClassList";

import classes from "./style.module.css";

type Props = {
  version?: string;
  className?: string;
};

export function Footer({ version, className }: Props) {
  const classList = new ClassList(classes.footer, className);

  return (
    <footer className={String(classList)}>
      <menu className={classes.menu}>
        <li>
          <Button as="a" href="/changelog" shape="text">
            What's new?
          </Button>
        </li>
        <li>
          <Button as="a" href="/help" shape="text">
            Help
          </Button>
        </li>
        <li>
          <Button as="a" href="https://github.com/workoelho" shape="text">
            GitHub
          </Button>
        </li>
      </menu>

      <p>©️ 2023 Workoelho</p>

      <code className={classes.version}>v{version}</code>
    </footer>
  );
}
