import { ChangeEvent, useCallback, useReducer } from "react";

import { map } from "~/src/lib/shared/map";

type FieldValue = string | number | boolean | File;

export type FieldState = {
  name: string;
  value: FieldValue;
  error?: Error;
  touched: boolean;
};

export type FormState = Record<string, FieldState>;

function reducer(
  state: FormState,
  patch: { name: string; value: FieldValue; error?: string },
) {
  return {
    ...state,
    [patch.name]: {
      ...state[patch.name],
      value: patch.value,
      touched: true,
    },
  };
}

function createInitialState(initialValues: Record<string, FieldValue>) {
  return map(initialValues, (value, name) => [
    name,
    {
      name,
      value,
      touched: false,
    },
  ]);
}

function isInputElement(
  element: HTMLElement,
): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  );
}

function getMessage(validity: ValidityState) {
  switch (true) {
    case validity.valueMissing:
      return "Required.";
    case validity.tooShort:
      return "Too short.";
    case validity.tooLong:
      return "Too long.";
    case validity.rangeOverflow:
      return "Too high.";
    case validity.rangeUnderflow:
      return "Too low.";
    case validity.patternMismatch:
    case validity.typeMismatch:
    case validity.badInput:
    case validity.stepMismatch:
      return "Invalid.";
    default:
      return;
  }
}

export function useForm(initialValues: Record<string, FieldValue> = {}) {
  const [state, dispatch] = useReducer(
    reducer,
    initialValues,
    createInitialState,
  );

  const onChange = useCallback((event: ChangeEvent<HTMLFormElement>) => {
    const { target } = event;

    if (!isInputElement(target)) {
      return;
    }
    const { name, value, validity } = target;

    dispatch({ name, value, error: getMessage(validity) });
  }, []);

  return { state, dispatch, onChange } as const;
}
