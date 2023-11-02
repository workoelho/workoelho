import { ElementType, forwardRef } from "react";

import { ClassList } from "~/lib/client/ClassList";
import { PolymorphicPropsWithRef, PolymorphicRef } from "~/lib/shared/react";

import classes from "./style.module.css";

type AcceptableElementType = "a" | "button";

export type Props = {
  variant?: "primary" | "neutral" | "positive" | "negative" | "attentive";
  shape?: "text" | "rectangle" | "pill";
  size?: "small" | "medium" | "large";
};

function Button<E extends AcceptableElementType = "button">(
  {
    as,
    children,
    variant = "neutral",
    size = "medium",
    shape = "rectangle",
    ...props
  }: PolymorphicPropsWithRef<E, Props>,
  ref: PolymorphicRef<E>
) {
  const Component = as ?? ("button" as ElementType);

  const classList = new ClassList(classes.button);
  classList.add(classes[variant]);
  classList.add(classes[shape]);
  classList.add(classes[size]);
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
