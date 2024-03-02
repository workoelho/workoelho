import { CSSProperties, ElementType, forwardRef } from "react";

import { ClassList } from "~/src/lib/shared/ClassList";
import type {
  PolymorphicPropsWithRef,
  PolymorphicRef,
} from "~/src/lib/shared/react";

import classes from "./style.module.css";

type AcceptableElementType =
  | "span"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "li";

type Props = {
  variant?: "neutral" | "positive" | "negative" | "attentive" | "muted";
  size?: "smaller" | "inherit" | "larger";
  weight?: CSSProperties["fontWeight"];
  decoration?: CSSProperties["textDecoration"];
};

function Text<E extends AcceptableElementType = "span">(
  {
    as,
    children,
    variant,
    size = "inherit",
    weight,
    ...props
  }: PolymorphicPropsWithRef<E, Props>,
  ref: PolymorphicRef<E>,
) {
  const Component = as ?? ("div" as ElementType);

  const classList = new ClassList(classes.text);
  if (props.className) {
    classList.add(props.className);
  }
  if (variant) {
    classList.add(classes[variant]);
  }
  classList.add(classes[size]);
  props.className = classList.toString();

  props.style = {
    ...props.style,
    textDecoration: props.decoration,
    fontWeight: weight,
  };

  return (
    <Component ref={ref} {...props}>
      {children}
    </Component>
  );
}
const forwardRefText = forwardRef(Text) as typeof Text;

export { forwardRefText as Text };
