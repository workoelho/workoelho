import { ClassList } from "~/src/lib/client/ClassList";

import classes from "./style.module.css";

type Props = {
  variant: keyof typeof variants;
  label?: string;
  className?: string;
  size?: string;
};

const variants = {
  "triangle down": <path d="M12 15L7 10H17L12 15Z" />,
};

export function Icon({ variant, label, size = "1.25em", className }: Props) {
  const style = {
    fontSize: size,
  };

  const classList = new ClassList(classes.icon);
  classList.add(className);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={classList.toString()}
      style={style}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
    >
      {variants[variant]}
    </svg>
  );
}
