"use client";

import { ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "~/components/Button";

type Props = {
  children: ReactNode;
};

export function Submit({ children }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Working..." : children}
    </Button>
  );
}
