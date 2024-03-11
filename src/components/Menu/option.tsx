"use client";

import type { ElementType, ReactNode } from "react";
import { forwardRef } from "react";
import Link from "next/link";

import type {
  PolymorphicPropsWithRef,
  PolymorphicRef,
} from "~/src/lib/shared/react";
import { ClassList } from "~/src/lib/shared/ClassList";

import classes from "./style.module.css";

type AcceptableElementType = "a" | "button" | typeof Link;

type Props = {
  action?: () => Promise<unknown>;
};

function Option<E extends AcceptableElementType = "button">(
  { as, action, ...props }: PolymorphicPropsWithRef<E, Props>,
  ref: PolymorphicRef<E>,
) {
  const Component = as ?? ("button" as ElementType);

  const classList = new ClassList(classes.item);
  if (props.className) {
    classList.add(props.className);
  }
  props.className = String(classList);

  if (action) {
    props.onClick = () => action();
  }

  return (
    <li>
      <Component ref={ref} {...props} />
    </li>
  );
}

const forwardRefOption = forwardRef(Option) as typeof Option;

export { forwardRefOption as Option };
