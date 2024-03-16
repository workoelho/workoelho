import { ReactNode, useId } from "react";

import { ClassList } from "~/src/lib/shared/ClassList";

import classes from "./style.module.css";

type InputProps = {
  id: string;
  "aria-describedby"?: string;
};

type FieldProps = {
  label?: ReactNode;
  hint?: ReactNode;
  status?: "valid" | "invalid";
  children: (props: InputProps) => ReactNode;
};

export function Field({ label, status, hint, children }: FieldProps) {
  const fieldId = useId();
  const hintId = useId();

  const classList = new ClassList(classes.field);
  if (status) {
    classList.add(classes[status]);
  }

  return (
    <div className={classList.toString()}>
      {label ? (
        <label htmlFor={fieldId} className={classes.label}>
          {label}
        </label>
      ) : null}
      {hint ? (
        <span id={hintId} className={classes.hint}>
          {hint}
        </span>
      ) : null}
      {children({ "aria-describedby": hint ? hintId : undefined, id: fieldId })}
    </div>
  );
}
