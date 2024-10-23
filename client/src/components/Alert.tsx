import type { ReactNode } from "react";

function Err({ error }: { error: unknown }) {
  return (
    <div className="flex flex-col gap-3">
      <p>There was an error:</p>
      <pre className="overflow-scroll text-xs text-wrap">
        {JSON.stringify(error)}
      </pre>
    </div>
  );
}

type Props = {
  error?: unknown | null;
  children?: ReactNode;
};

export function Alert({ error, children }: Props) {
  if (error) {
    children = <Err error={error} />;
  }

  if (!children) {
    return null;
  }

  return (
    <div className="p-6 border rounded-sm border-zinc-700">{children}</div>
  );
}
