import { InputHTMLAttributes } from "react";
import { ClassList } from "~/lib/client/ClassList";
import classes from "./style.module.css";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input(props: Props) {
  const classList = new ClassList(classes.input);
  classList.add(props.className);
  props.className = classList.toString();

  return <input {...props} />;
}
