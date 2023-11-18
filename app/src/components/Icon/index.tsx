import { ClassList } from "~/src/lib/client/ClassList";

import classes from "./style.module.css";

type Props = {
  name: keyof typeof icons;
  label?: string;
  className?: string;
  size?: string;
};

const icons = {
  ellipsis: (
    <path d="M6 14c-.55 0-1.021-.196-1.413-.588A1.922 1.922 0 0 1 4 12c0-.55.196-1.021.588-1.413A1.922 1.922 0 0 1 6 10c.55 0 1.021.196 1.413.588.392.392.588.863.587 1.412 0 .55-.196 1.021-.588 1.413A1.922 1.922 0 0 1 6 14Zm6 0c-.55 0-1.021-.196-1.413-.588A1.922 1.922 0 0 1 10 12c0-.55.196-1.021.588-1.413A1.922 1.922 0 0 1 12 10c.55 0 1.021.196 1.413.588.392.392.588.863.587 1.412 0 .55-.196 1.021-.588 1.413A1.922 1.922 0 0 1 12 14Zm6 0c-.55 0-1.021-.196-1.413-.588A1.922 1.922 0 0 1 16 12c0-.55.196-1.021.588-1.413A1.922 1.922 0 0 1 18 10c.55 0 1.021.196 1.413.588.392.392.588.863.587 1.412 0 .55-.196 1.021-.588 1.413A1.922 1.922 0 0 1 18 14Z" />
  ),
  "chevron/down": <path d="m12 15.4-6-6L7.4 8l4.6 4.6L16.6 8 18 9.4l-6 6Z" />,
  "arrow/right": (
    <path d="M16.175 13H4v-2h12.175l-5.6-5.6L12 4l8 8-8 8-1.425-1.4 5.6-5.6Z" />
  ),
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
      {icons[name]}
    </svg>
  );
}
