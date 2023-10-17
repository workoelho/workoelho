import { ChangeEvent, createContext, useMemo, useReducer } from "react";
import { AnyZodObject, ZodError, z } from "zod";
import { mapValues } from "~/lib/map";

type FieldState = {
  name: string;
  value: string;
  error: undefined | ZodError;
  touched: boolean;
};

type FormState<T extends Record<string, unknown>> = {
  [K in keyof T]: FieldState;
};

type FormPatch = {
  name: string;
  value: string;
};

type ContextValue = {
  fields: Record<string, FieldState & { change(value: string): void }>;
  parse(): any;
};

export const Context = createContext({} as ContextValue);

export function createState<T extends AnyZodObject>(schema: T) {
  return mapValues(schema.shape, (_, name) => ({
    name,
    value: "",
    error: undefined,
    touched: false,
  })) as FormState<z.TypeOf<T>>;
}

export function getReducer<T extends AnyZodObject>(schema: T) {
  return (state: FormState<z.TypeOf<T>>, { name, value }: FormPatch) => {
    if (!name) {
      return state;
    }

    try {
      state[name].value = schema.shape[name].parse(value);
      state[name].error = undefined;
    } catch (err) {
      if (err instanceof ZodError) {
        state[name].error = err;
      } else {
        throw err;
      }
    } finally {
      state[name].touched = true;
    }
    return { ...state } as FormState<z.TypeOf<T>>;
  };
}

export function useForm<T extends AnyZodObject>(schema: T) {
  const [state, update] = useReducer(getReducer(schema), createState(schema));

  console.table(state);

  const parse = () => {
    return schema.parse(
      mapValues(state, (state) => state.value),
    ) as z.TypeOf<T>;
  };

  return {
    fields: useMemo(
      () =>
        mapValues(state, (state, name) => ({
          ...state,
          change(value: string) {
            update({ name: name as string, value });
          },
        })),
      [state],
    ),
    parse,
  } as const;
}

export function getErrorMessage(ctx: ContextValue, name: string) {
  return ctx.fields[name].error?.issues[0].message;
}

export function getInputProps(ctx: ContextValue, name: string) {
  return {
    onChange(event: ChangeEvent<HTMLInputElement>) {
      ctx.fields[name].change(event.target.value);
    },
  };
}
