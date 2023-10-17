import { ButtonHTMLAttributes } from "react";
import { ClassList } from "~/lib/client/ClassList";
import classes from "./style.module.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ ...props }: Props) {
  const classList = new ClassList(classes.button);
  classList.add(props.className);
  props.className = classList.toString();

  return <button {...props} />;
}
