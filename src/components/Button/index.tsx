import { ComponentProps } from "react";

import * as classes from "./style.module.css";

type Props =
  | (ComponentProps<"button"> & {
      method: "get" | "post";
      action: string;
    })
  | ComponentProps<"button">;

export function Button(props: Props) {
  props.className = classes.button;

  if ("action" in props) {
    const { action, method, ...button } = props;

    return (
      <form method={method} action={action}>
        <button {...button} />
      </form>
    );
  }

  return <button {...props} />;
}
