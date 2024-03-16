import { useState } from "react";

export function useList<T>(initialValue: T[]) {
  const [list, setList] = useState(initialValue);

  const push = (value: T) => {
    return setList((list) => [...list, value]);
  };

  const remove = (index: number) => {
    return setList((list) => list.filter((_, i) => i !== index));
  };

  const update = (index: number, value: T) => {
    return setList((list) => {
      const copy = [...list];
      copy[index] = value;
      return copy;
    });
  };

  return { list, push, remove, update } as const;
}
