import { ReactNode, useId } from "react";

import { ClassList } from "~/src/lib/shared/ClassList";
import { FieldState } from "~/src/lib/client/form";

import classes from "./style.module.css";

type InputProps = {
  "aria-describedby"?: string;
};

type FieldProps = {
  label?: ReactNode;
  state?: FieldState;
  hint?: ReactNode;
  children: (props: InputProps) => ReactNode;
};

export function Field({ label, state, children, ...props }: FieldProps) {
  const hintId = useId();
  const hint = state?.error?.message ?? props.hint;

  const classList = new ClassList(classes.field);
  if (state?.touched) {
    if (state.error) {
      classList.add(classes.invalid);
    } else {
      classList.add(classes.valid);
    }
  }

  return (
    <label className={classList.toString()}>
      {label ? <span className={classes.label}>{label}</span> : null}
      {children({ "aria-describedby": hintId })}
      {hint ? (
        <span
          id={hintId}
          className={classes.hint}
          aria-live={state?.error ? "polite" : undefined}
        >
          {hint}
        </span>
      ) : null}
    </label>
  );
}
