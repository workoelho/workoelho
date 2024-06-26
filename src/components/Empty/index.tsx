import type { ReactNode } from "react";

import { Card } from "~/src/components/Card";
import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";

type Props = {
  title?: ReactNode;
  size?: "small" | "large";
  children?: ReactNode;
};

const gapSizeMap = {
  small: undefined,
  large: "1rem",
} as const;

const headingSizeMap = {
  small: "medium",
  large: "large",
} as const;

export function Empty({ title = "Empty", size = "small", children }: Props) {
  return (
    <Card as="aside" size="large" style={{ paddingInline: "3rem" }}>
      <Flex direction="column" alignItems="center" gap={gapSizeMap[size]}>
        <Heading variant="ghost" size={headingSizeMap[size]}>
          {title}
        </Heading>

        {children}
      </Flex>
    </Card>
  );
}
