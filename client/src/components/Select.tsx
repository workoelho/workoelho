import type { ComponentProps } from "react";

type Props = ComponentProps<"select">;

export function Select({ className, ...props }: Props) {
  return (
    <select
      {...props}
      className={`appearance-none h-10 p-2 border rounded-sm invalid:text-zinc-600 border-zinc-500 bg-zinc-800 ${className}`}
    />
  );
}
