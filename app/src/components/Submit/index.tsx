import { ReactNode } from "react";

import { Button, type Props as ButtonProps } from "~/components/Button";

type Props = ButtonProps & {
  children: ReactNode;
  loading?: boolean;
};

export function Submit({ children, loading, ...props }: Props) {
  return (
    <Button type="submit" disabled={loading} {...props}>
      {loading ? "Working..." : children}
    </Button>
  );
}
