import { ElementType, forwardRef } from "react";

import { ClassList } from "~/src/lib/shared/ClassList";
import {
  PolymorphicPropsWithRef,
  PolymorphicRef,
} from "~/src/lib/shared/react";

import classes from "./style.module.css";

type AcceptableElementType =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "p"
  | "span"
  | "legend";

type Props = {
  size: "massive" | "large" | "medium" | "small";
  variant?:
    | "neutral"
    | "positive"
    | "negative"
    | "attentive"
    | "muted"
    | "ghost";
};

function Heading<E extends AcceptableElementType>(
  { as, size, variant, children, ...props }: PolymorphicPropsWithRef<E, Props>,
  ref: PolymorphicRef<E>
) {
  const Component = as ?? ("span" as ElementType);

  const classList = new ClassList(classes.heading, classes[size]);
  if (variant) {
    classList.add(classes[variant]);
  }
  if (props.className) {
    classList.add(props.className);
  }
  props.className = String(classList);

  return (
    <Component ref={ref} {...props}>
      {children}
    </Component>
  );
}
const forwardRefHeading = forwardRef(Heading) as typeof Heading;

export { forwardRefHeading as Heading };
