import { type ElementType, forwardRef, CSSProperties } from "react";

import { ClassList } from "~/lib/client/ClassList";
import {
  type PolymorphicPropsWithRef,
  type PolymorphicRef,
} from "~/lib/shared/react";

import classes from "./style.module.css";

type AcceptableElementType =
  | "div"
  | "nav"
  | "main"
  | "header"
  | "section"
  | "article"
  | "footer"
  | "figure"
  | "form";

type Props = {
  padding?: CSSProperties["padding"];
  paddingBlock?: CSSProperties["paddingBlock"];
  paddingInline?: CSSProperties["paddingInline"];
};

function Box<E extends AcceptableElementType = "div">(
  {
    as,
    padding,
    paddingBlock,
    paddingInline,
    children,
    ...props
  }: PolymorphicPropsWithRef<E, Props>,
  ref: PolymorphicRef<E>,
) {
  const Component = as ?? ("div" as ElementType);

  const classList = new ClassList(classes.box);
  classList.add(props.className);
  props.className = classList.toString();

  props.style = {
    padding,
    paddingBlock,
    paddingInline,
    ...props.style,
  };

  return (
    <Component ref={ref} {...props}>
      {children}
    </Component>
  );
}
const forwardRefBox = forwardRef(Box) as typeof Box;

export { forwardRefBox as Box };
