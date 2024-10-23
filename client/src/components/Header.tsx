import type { ReactNode } from "react";

type Props = {
  title: string;
  children?: ReactNode;
};

export function Header({ title, children }: Props) {
  return (
    <header className="flex items-center h-10 gap-3">
      <h1 className="text-2xl font-bold">{title}</h1>
      <hr className="border-zinc-300 grow" />
      {children}
    </header>
  );
}
