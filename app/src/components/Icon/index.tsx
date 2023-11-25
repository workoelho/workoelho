import { ClassList } from "~/src/lib/client/ClassList";

import classes from "./style.module.css";

type Props = {
  name: string;
  label?: string;
  className?: string;
  size?: string;
};

export function Icon({ name, label, size = "1em", className }: Props) {
  const classList = new ClassList(classes.icon);
  classList.add(className);

  const style = {
    fontSize: size,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={String(classList)}
      style={style}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
    >
      <use xlinkHref={`/icon.svg#${name}`} />
    </svg>
  );
}
