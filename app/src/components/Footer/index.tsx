import { ClassList } from "~/lib/client/ClassList";
import classes from "./style.module.css";
import { Flex } from "~/components/Flex";

type Props = {
  className?: string;
};

export function Footer({ className }: Props) {
  const classList = new ClassList(classes.footer, className);

  return (
    <footer className={classList.toString()}>
      <Flex style={{ gridColumn: 2 }} gap="3rem">
        <p>©️ 2023 Workoelho</p>

        <Flex as="ul" gap="1.5rem">
          <li>
            <a href="/">GitHub</a>
          </li>
          <li>
            <a href="/">What&apos;s new?</a>
          </li>
          <li>
            <a href="/">Privacy policy</a>
          </li>
          <li>
            <a href="/">Help</a>
          </li>
        </Flex>
      </Flex>

      <p className={classes.version}>v23.10.28-39dd4</p>
    </footer>
  );
}
