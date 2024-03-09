import type { ElementType, ReactNode } from "react";
import { forwardRef } from "react";
import Link from "next/link";

import type {
  PolymorphicPropsWithRef,
  PolymorphicRef,
} from "~/src/lib/shared/react";
import { ClassList } from "~/src/lib/shared/ClassList";

import classes from "./style.module.css";

type MenuProps = {
  children: ReactNode;
};

export function Menu({ children }: MenuProps) {
  return <menu className={classes.menu}>{children}</menu>;
}

type AcceptableElementType = "a" | "button" | typeof Link;

function Option<E extends AcceptableElementType = "button">(
  { as, ...props }: PolymorphicPropsWithRef<E, {}>,
  ref: PolymorphicRef<E>
) {
  const Component = as ?? ("button" as ElementType);

  const classList = new ClassList(classes.item);
  if (props.className) {
    classList.add(props.className);
  }
  props.className = String(classList);

  return (
    <li>
      <Component ref={ref} {...props} />
    </li>
  );
}
const forwardRefOption = forwardRef(Option) as typeof Option;
export { forwardRefOption as Option };

export function Separator() {
  return (
    <li className={classes.separator}>
      <hr />
    </li>
  );
}
