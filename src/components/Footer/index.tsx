import Link from "next/link";

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
          <Button as={Link} href="/changelog" shape="text">
            What's new?
          </Button>
        </li>
        <li>
          <Button as={Link} href="/help" shape="text">
            Help
          </Button>
        </li>
        <li>
          <Button as={Link} href="https://github.com/workoelho" shape="text">
            GitHub
          </Button>
        </li>
      </menu>

      <p>©️ 2023 Workoelho</p>

      <p>Version {version}</p>
    </footer>
  );
}
