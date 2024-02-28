import { ElementType, forwardRef } from "react";

import { ClassList } from "~/src/lib/shared/ClassList";
import {
  PolymorphicPropsWithRef,
  PolymorphicRef,
} from "~/src/lib/shared/react";

import classes from "./style.module.css";

type AcceptableElementType = "a" | "button";

export type Props = {
  variant?: "interactive" | "neutral" | "positive" | "negative" | "attentive";
  shape?: "text" | "rectangle" | "pill";
};

function Button<E extends AcceptableElementType = "button">(
  {
    as,
    children,
    variant = "neutral",
    shape = "rectangle",
    ...props
  }: PolymorphicPropsWithRef<E, Props>,
  ref: PolymorphicRef<E>
) {
  const Component = as ?? ("button" as ElementType);

  const classList = new ClassList(classes.button);
  classList.add(classes[variant]);
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
