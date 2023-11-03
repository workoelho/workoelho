import { ClassList } from "~/lib/client/ClassList";

import classes from "./style.module.css";

type Props = {
  variant: keyof typeof variants;
  label?: string;
  className?: string;
  size?: string;
};

const variants = {
  "triangle down": (
    <path d="M5.076 9.943A1 1 0 0 1 6 9.325h12a1 1 0 0 1 .707 1.707l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1-.217-1.09Zm3.338 1.382L12 14.911l3.586-3.586H8.414Z" />
  ),
  "looking glass": (
    <path d="M6.939 2.609a8 8 0 0 1 9.38 12.296l5.388 5.388a1 1 0 0 1-1.414 1.414l-5.388-5.387A8 8 0 1 1 6.94 2.609ZM10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" />
  ),
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
