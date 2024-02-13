import { ComponentProps, ReactNode } from "react";

import classes from "./style.module.css";

type MenuProps = {
  children: ReactNode;
};

export function Menu({ children }: MenuProps) {
  return <menu className={classes.menu}>{children}</menu>;
}

type ItemProps = ComponentProps<"a"> | ComponentProps<"button">;

function Item(props: ItemProps) {
  if ("href" in props) {
    return (
      <li>
        <a {...(props as any)} className={classes.item} />
      </li>
    );
  }

  return (
    <li>
      <button {...(props as any)} className={classes.item} />
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
