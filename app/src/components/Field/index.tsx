import { ReactNode, useId } from "react";
import { ClassList } from "~/lib/client/ClassList";
import classes from "./style.module.css";

type Props = {
  label: ReactNode;
  valid?: boolean;
  hint?: ReactNode;
  children: (props: {
    fieldId: string;
    hintId: string | undefined;
  }) => ReactNode;
};

export function Field({ label, valid, hint, children }: Props) {
  const fieldId = `field-${useId()}`;
  const hintId = hint ? `${fieldId}-hint` : undefined;

  const classList = new ClassList(classes.field);
  if (valid === true) {
    classList.add(classes.valid);
  } else if (valid === false) {
    classList.add(classes.error);
  }

  return (
    <div className={classList.toString()}>
      <label htmlFor={fieldId}>{label}</label>
      {children({ fieldId, hintId })}
      {hint ? (
        <span id={hintId} className={classes.hint}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}
