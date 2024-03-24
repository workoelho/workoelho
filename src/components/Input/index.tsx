import { forwardRef, type ComponentProps, ComponentPropsWithRef } from "react";

import { ClassList } from "~/src/lib/shared/ClassList";

import classes from "./style.module.css";

type Props = ComponentProps<"input">;

function Input(props: Props, ref: Props["ref"]) {
  const classList = new ClassList(classes.input);
  if (props.className) {
    classList.add(props.className);
  }

  return <input ref={ref} {...props} className={String(classList)} />;
}

const forwardRefInput = forwardRef(Input);
export { forwardRefInput as Input };
