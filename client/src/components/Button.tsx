import type { ComponentProps } from "react";

type Props = ComponentProps<"button"> & {
  variant?: "default" | "small";
};

export function Button({
  type = "button",
  variant = "default",
  ...props
}: Props) {
  if (variant === "small") {
    props.className = `text-xs ${props.className}`;
  } else if (variant === "default") {
    props.className = `bg-zinc-100 text-zinc-900 rounded-sm px-6 h-10 ${props.className}`;
  }

  return (
    <button
      {...props}
      type={type}
      className={`disabled:opacity-50 disabled:cursor-not-allowed font-bold ${props.className}`}
    />
  );
}
