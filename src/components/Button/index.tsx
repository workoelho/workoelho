import { ElementType, forwardRef } from "react";
import type Link from "next/link";

import { ClassList } from "~/src/lib/shared/ClassList";
import {
  PolymorphicPropsWithRef,
  PolymorphicRef,
} from "~/src/lib/shared/react";

import classes from "./style.module.css";

type AcceptableElementType = "a" | "button" | typeof Link;

export type Props = {
  variant?: "neutral" | "interactive" | "positive" | "negative" | "attentive";
  shape?: "text" | "rectangle" | "pill";
  fill?: "solid" | "outline";
};

function Button<E extends AcceptableElementType = "button">(
  {
    as,
    children,
    variant = "neutral",
    shape = "rectangle",
    fill = "solid",
    ...props
  }: PolymorphicPropsWithRef<E, Props>,
  ref: PolymorphicRef<E>
) {
  const Component = as ?? ("button" as ElementType);

  const classList = new ClassList(classes.button);
  classList.add(classes[variant]);
  classList.add(classes[shape]);
  if (shape !== "text") {
    classList.add(classes[fill]);
  }
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
