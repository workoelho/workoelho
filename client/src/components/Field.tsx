import { useId } from "react";

type Props = {
  label: string;
  children: (props: { id: string }) => JSX.Element;
};

export function Field({ ...props }: Props) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-bold">
        {props.label}
      </label>
      {props.children({ id })}
    </div>
  );
}
