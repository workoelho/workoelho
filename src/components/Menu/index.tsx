import { ComponentProps, ReactNode } from "react";

import { ClassList } from "~/src/lib/shared/ClassList";

import classes from "./style.module.css";

type MenuProps = {
  children: ReactNode;
};

export function Menu({ children }: MenuProps) {
  return <menu className={classes.menu}>{children}</menu>;
}

type ItemProps = ComponentProps<"a"> | ComponentProps<"button">;

function isAnchor(props: ItemProps): props is ComponentProps<"a"> {
  return "href" in props;
}

function Item({ ...props }: ItemProps) {
  const classList = new ClassList(classes.item);
  classList.add(props.className);
  props.className = String(classList);

  if (isAnchor(props)) {
    return (
      <li>
        <a {...props} className={classes.item} />
      </li>
    );
  }

  return (
    <li>
      <button {...props} className={classes.item} />
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
