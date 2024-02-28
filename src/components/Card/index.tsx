import { ElementType, forwardRef } from "react";

import { ClassList } from "~/src/lib/shared/ClassList";
import type {
  PolymorphicPropsWithRef,
  PolymorphicRef,
} from "~/src/lib/shared/react";

import classes from "./style.module.css";

type AcceptableElementType =
  | "span"
  | "div"
  | "nav"
  | "li"
  | "main"
  | "header"
  | "section"
  | "article"
  | "footer"
  | "figure"
  | "menu"
  | "fieldset"
  | "form";

type Props = {
  size?: "medium" | "large";
};

function Card<E extends AcceptableElementType = "div">(
  {
    as,
    children,
    size = "medium",
    ...props
  }: PolymorphicPropsWithRef<E, Props>,
  ref: PolymorphicRef<E>,
) {
  const Component = as ?? ("div" as ElementType);

  const classList = new ClassList();
  classList.add(classes.card);
  classList.add(classes[size]);
  if (props.className) {
    classList.add(props.className);
  }
  props.className = classList.toString();

  return (
    <Component ref={ref} {...props}>
      {children}
    </Component>
  );
}
const forwardRefCard = forwardRef(Card) as typeof Card;

export { forwardRefCard as Card };
