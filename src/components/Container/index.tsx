import { forwardRef, type CSSProperties, type ElementType } from "react";

import { ClassList } from "~/src/lib/shared/ClassList";
import {
  type PolymorphicPropsWithRef,
  type PolymorphicRef,
} from "~/src/lib/shared/react";

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
  size?: "small" | "medium" | "large";
  padding?: CSSProperties["padding"];
  paddingBlock?: CSSProperties["paddingBlock"];
  paddingInline?: CSSProperties["paddingInline"];
};

function Container<E extends AcceptableElementType = "div">(
  {
    as,
    size = "large",
    padding,
    paddingBlock,
    paddingInline,
    children,
    ...props
  }: PolymorphicPropsWithRef<E, Props>,
  ref: PolymorphicRef<E>,
) {
  const Component = as ?? ("div" as ElementType);

  const classList = new ClassList(classes.container, classes[size]);
  if (props.className) {
    classList.add(props.className);
  }
  props.className = String(classList);

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
const forwardRefContainer = forwardRef(Container) as typeof Container;

export { forwardRefContainer as Container };
