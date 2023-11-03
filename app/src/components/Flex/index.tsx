import { CSSProperties, ElementType, forwardRef } from "react";

import { ClassList } from "~/lib/client/ClassList";
import { PolymorphicPropsWithRef, PolymorphicRef } from "~/lib/shared/react";

import classes from "./style.module.css";

type AcceptableElementType =
  | "span"
  | "div"
  | "nav"
  | "ul"
  | "ol"
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
  direction?: CSSProperties["flexDirection"];
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
  gap?: CSSProperties["gap"];
  wrap?: CSSProperties["flexWrap"];
};

function Flex<E extends AcceptableElementType = "div">(
  {
    as,
    children,
    direction,
    alignItems = direction !== "column" ? "center" : undefined,
    justifyContent,
    gap,
    wrap,
    ...props
  }: PolymorphicPropsWithRef<E, Props>,
  ref: PolymorphicRef<E>,
) {
  const Component = as ?? ("div" as ElementType);

  const classList = new ClassList();
  classList.add(classes.flex);
  if (props.className) {
    classList.add(props.className);
  }
  props.className = classList.toString();

  props.style = {
    flexDirection: direction,
    alignItems: alignItems,
    justifyContent: justifyContent,
    gap,
    flexWrap: wrap,
    ...props.style,
  };

  return (
    <Component ref={ref} {...props}>
      {children}
    </Component>
  );
}
const forwardRefFlex = forwardRef(Flex) as typeof Flex;

export { forwardRefFlex as Flex };
