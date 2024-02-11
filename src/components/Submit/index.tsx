"use client";

import { ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { Button, type Props as ButtonProps } from "~/src/components/Button";

type Props = ButtonProps & {
  children: ReactNode;
};

export function Submit({ children, ...props }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? "Working..." : children}
    </Button>
  );
}
