import { ElementType, forwardRef } from "react";

import { ClassList } from "~/lib/client/ClassList";
import { PolymorphicPropsWithRef, PolymorphicRef } from "~/lib/shared/react";

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
};

function Heading<E extends AcceptableElementType>(
  { as, size, children, ...props }: PolymorphicPropsWithRef<E, Props>,
  ref: PolymorphicRef<E>,
) {
  const Component = as ?? ("span" as ElementType);

  const classList = new ClassList(
    classes.heading,
    classes[size],
    props.className,
  );
  props.className = classList.toString();

  return (
    <Component ref={ref} {...props}>
      {children}
    </Component>
  );
}
const forwardRefHeading = forwardRef(Heading) as typeof Heading;

export { forwardRefHeading as Heading };
