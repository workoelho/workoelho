import { HTMLAttributes, ReactNode } from "react";

import classes from "./style.module.css";

type MenuProps = {
  children: ReactNode;
};

export function Menu({ children }: MenuProps) {
  return <menu className={classes.menu}>{children}</menu>;
}

type ItemProps =
  | HTMLAttributes<HTMLAnchorElement>
  | HTMLAttributes<HTMLButtonElement>;

function Item<T extends ItemProps>(props: T) {
  const Component = "href" in props ? "a" : "button";

  return (
    <li>
      <Component {...(props as any)} className={classes.item} />
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
