import type { ComponentProps } from "react";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={`border rounded-sm placeholder:text-zinc-600 border-zinc-500 bg-zinc-800 p-2 h-10 ${className}`}
    />
  );
}
