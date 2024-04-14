import type { ChangeEvent, ComponentProps } from "react";
import { useState } from "react";

import { ClassList } from "~/src/lib/shared/ClassList";

import classes from "./style.module.css";

type Props = ComponentProps<"select">;

export function Select(props: Props) {
  const [isEmpty, setEmpty] = useState(!(props.value || props.defaultValue));

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setEmpty(!event.target.value);
  };

  const classList = new ClassList(classes.select);
  if (props.className) {
    classList.add(props.className);
  }
  if (isEmpty) {
    classList.add(classes.empty);
  }

  return (
    <select {...props} className={String(classList)} onChange={handleChange} />
  );
}
