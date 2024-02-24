import { ReactNode, useId } from "react";

import { ClassList } from "~/src/lib/shared/ClassList";

import classes from "./style.module.css";

type InputProps = {
  "aria-describedby"?: string;
};

type FieldProps = {
  label?: ReactNode;
  hint?: ReactNode;
  state?: "valid" | "invalid";
  children: (props: InputProps) => ReactNode;
};

export function Field({ label, state, hint, children, ...props }: FieldProps) {
  const hintId = useId();

  const classList = new ClassList(classes.field);
  if (state) {
    classList.add(classes[state]);
  }

  return (
    <label className={classList.toString()}>
      {label ? <span className={classes.label}>{label}</span> : null}
      {children({ "aria-describedby": hintId })}
      {hint ? (
        <span
          id={hintId}
          className={classes.hint}
          aria-live={state ? "polite" : undefined}
        >
          {hint}
        </span>
      ) : null}
    </label>
  );
}
