import { Button } from "~/src/components/Button";
import { ClassList } from "~/src/lib/client/ClassList";

import classes from "./style.module.css";

type Props = {
  version?: string;
  className?: string;
};

export function Footer({ version, className }: Props) {
  const classList = new ClassList(classes.footer, className);

  return (
    <footer className={classList.toString()}>
      <menu className={classes.menu}>
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
          <Button as="a" href="/help" shape="text" size="small">
            Help
          </Button>
        </li>
      </menu>

      <p className={classes.copyright}>
        ©️ 2023 Workoelho <span>v{version}</span>
      </p>
    </footer>
  );
}
