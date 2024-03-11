import { forwardRef, type ElementType, type ReactNode } from "react";

import type {
  PolymorphicPropsWithRef,
  PolymorphicRef,
} from "~/src/lib/shared/react";
import { ClassList } from "~/src/lib/shared/ClassList";

import classes from "./style.module.css";

type AcceptableElementType = "div" | "aside" | "header" | "section";

type Props = {
  children?: ReactNode;
};

function Header<E extends AcceptableElementType = "header">(
  { as, ...props }: PolymorphicPropsWithRef<E, Props>,
  ref: PolymorphicRef<E>,
) {
  const Component = as ?? ("div" as ElementType);

  const classList = new ClassList(classes.header);
  if (props.className) {
    classList.add(props.className);
  }
  props.className = String(classList);

  return <Component ref={ref} {...props} />;
}

const forwardRefHeader = forwardRef(Header) as typeof Header;

export { forwardRefHeader as Header };
