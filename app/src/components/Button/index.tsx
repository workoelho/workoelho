import { CSSProperties, ElementType, forwardRef } from "react";

import { ClassList } from "~/lib/client/ClassList";
import { PolymorphicPropsWithRef, PolymorphicRef } from "~/lib/shared/react";

import classes from "./style.module.css";

type AcceptableElementType = "a" | "button";

type Props = {
  variant?: "filled";
  color?: "primary";
  shape?: "rectangle" | "pill";
};

function Button<E extends AcceptableElementType = "button">(
  {
    as,
    children,
    variant = "filled",
    color = "primary",
    shape = "rectangle",
    ...props
  }: PolymorphicPropsWithRef<E, Props>,
  ref: PolymorphicRef<E>
) {
  const Component = as ?? ("button" as ElementType);

  const classList = new ClassList(classes.button);
  classList.add(classes[variant]);
  classList.add(classes[color]);
  classList.add(classes[shape]);
  classList.add(props.className);
  props.className = classList.toString();

  return (
    <Component ref={ref} {...props}>
      {children}
    </Component>
  );
}
const forwardRefButton = forwardRef(Button) as typeof Button;

export { forwardRefButton as Button };
