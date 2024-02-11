import { InputHTMLAttributes } from "react";

import { ClassList } from "~/src/lib/client/ClassList";

import classes from "./style.module.css";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input(props: Props) {
  const classList = new ClassList(classes.input);
  classList.add(props.className);

  return <input {...props} className={classList.toString()} />;
}
