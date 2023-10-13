import { Children, ReactNode, cloneElement, useContext, useId } from "react";
import { ClassList } from "~/lib/classList";
import { Context, getErrorMessage, getInputProps } from "~/lib/useForm";
import classes from "./style.module.css";

type Props = {
  name: string;
  label: string;
  hint?: ReactNode;
  children: JSX.Element;
};

export function Field({ name, label, hint, children }: Props) {
  const form = useContext(Context);
  const id = `field-${useId()}`;
  const error = getErrorMessage(form, name);

  const classList = new ClassList(classes.field);
  if (form.fields[name].touched) {
    if (form.fields[name].error) {
      classList.add(classes.error);
    } else {
      classList.add(classes.valid);
    }
  }

  return (
    <div className={classList.toString()}>
      <label htmlFor={id}>{label}</label>
      {cloneElement(Children.only(children), {
        id,
        ...getInputProps(form, name),
      })}
      <span>{error ?? hint}</span>
    </div>
  );
}
