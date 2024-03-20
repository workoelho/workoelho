import type { ReactNode } from "react";

import { Card } from "~/src/components/Card";
import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";

type Props = {
  title?: ReactNode;
  size?: "small" | "large";
  children?: ReactNode;
};

const sizeGapMap = {
  small: undefined,
  large: "1rem",
} as const;

const sizeHeadingMap = {
  small: "medium",
  large: "large",
} as const;

export function Empty({ title = "Empty", size = "small", children }: Props) {
  return (
    <Card as="aside" size="large">
      <Flex direction="column" alignItems="center" gap={sizeGapMap[size]}>
        <Heading variant="ghost" size={sizeHeadingMap[size]}>
          {title}
        </Heading>

        {children}
      </Flex>
    </Card>
  );
}
