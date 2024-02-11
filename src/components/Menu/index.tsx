import { ComponentProps, HTMLAttributes, ReactNode } from "react";

import classes from "./style.module.css";

type MenuProps = {
  children: ReactNode;
};

export function Menu({ children }: MenuProps) {
  return <menu className={classes.menu}>{children}</menu>;
}

type ItemProps = { action?: (...args: any[]) => any } & (
  | ComponentProps<"a">
  | ComponentProps<"button">
);

function Item(props: ItemProps) {
  if ("href" in props) {
    return (
      <li>
        <a {...props} className={classes.item} />
      </li>
    );
  }

  const { action, ...button } = props;

  if (action) {
    return (
      <li>
        <form action={action}>
          <button {...(button as any)} className={classes.item} />
        </form>
      </li>
    );
  }

  return (
    <li>
      <button {...(button as any)} className={classes.item} />
    </li>
  );
}

function Separator() {
  return (
    <li className={classes.separator}>
      <hr />
    </li>
  );
}

Menu.Item = Item;
Menu.Separator = Separator;
