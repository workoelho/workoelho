import type { ElementType, ReactNode } from "react";
import { forwardRef } from "react";

import type {
  PolymorphicPropsWithRef,
  PolymorphicRef,
} from "~/src/lib/shared/react";
import { ClassList } from "~/src/lib/shared/ClassList";
import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";

import classes from "./style.module.css";

type AcceptableElementType = "div" | "aside" | "header" | "section";

type Props = {
  title: ReactNode;
  description?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
};

function Header<E extends AcceptableElementType = "header">(
  {
    as,
    title,
    description,
    left = <div />,
    right = <div />,
    ...props
  }: PolymorphicPropsWithRef<E, Props>,
  ref: PolymorphicRef<E>,
) {
  const Component = as ?? ("header" as ElementType);

  const classList = new ClassList(classes.header);
  if (props.className) {
    classList.add(props.className);
  }
  props.className = String(classList);

  return (
    <Component ref={ref} {...props}>
      {left}

      <Flex direction="column" alignItems="center" gap=".375rem">
        <Heading as="h1" size="large">
          {title}
        </Heading>

        {description}
      </Flex>

      {right}
    </Component>
  );
}

const forwardRefHeader = forwardRef(Header);

export { forwardRefHeader as Header };
