import { useId } from "react";

type Props = {
  label: string;
  children: (props: { id: string }) => JSX.Element;
};

export function Field({ label, children }: Props) {
  const id = useId();

  return (
    <div className="field">
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children({ id })}
    </div>
  );
}
