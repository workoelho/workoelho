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
  template?: CSSProperties["gridTemplate"];
  gap?: CSSProperties["gap"];
  autoRows?: CSSProperties["gridAutoRows"];
  autoColumns?: CSSProperties["gridAutoColumns"];
  autoFlow?: CSSProperties["gridAutoFlow"];
  alignItems?: CSSProperties["alignItems"];
  justifyItems?: CSSProperties["justifyItems"];
  alignContent?: CSSProperties["alignContent"];
  justifyContent?: CSSProperties["justifyContent"];
};

function Grid<E extends AcceptableElementType = "div">(
  {
    as,
    children,
    template,
    gap,
    autoRows,
    autoColumns,
    autoFlow = autoRows ? "row" : autoColumns ? "column" : undefined,
    alignItems,
    justifyItems,
    alignContent,
    justifyContent,
    ...props
  }: PolymorphicPropsWithRef<E, Props>,
  ref: PolymorphicRef<E>
) {
  const Component = as ?? ("div" as ElementType);

  const classList = new ClassList();
  classList.add(classes.grid);
  if (props.className) {
    classList.add(props.className);
  }
  props.className = classList.toString();

  props.style = {
    gridTemplate: template,
    gridAutoColumns: autoColumns,
    gridAutoRows: autoRows,
    gridAutoFlow: autoFlow,
    alignItems: alignItems,
    justifyItems: justifyItems,
    alignContent: alignContent,
    justifyContent: justifyContent,
    gap: gap,
    ...props.style,
  };

  return (
    <Component ref={ref} {...props}>
      {children}
    </Component>
  );
}
const forwardRefGrid = forwardRef(Grid) as typeof Grid;

export { forwardRefGrid as Grid };
