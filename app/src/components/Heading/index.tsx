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
  | "span"
  | "legend";

type Props = {
  level: 1 | 2 | 3 | 4 | 5;
};

function Heading<E extends AcceptableElementType>(
  { as, level, children, ...props }: PolymorphicPropsWithRef<E, Props>,
  ref: PolymorphicRef<E>,
) {
  const Component = as ?? (("h" + level) as ElementType);

  const classList = new ClassList(
    classes.heading,
    classes[`level-${level}`],
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
