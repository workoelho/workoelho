import { ComponentProps } from "react";

type Props =
  | (ComponentProps<"button"> & {
      method: "get" | "post";
      action: string;
    })
  | ComponentProps<"button">;

export function Button(props: Props) {
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
