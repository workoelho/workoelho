import { FormEvent, FormHTMLAttributes } from "react";

import { Context } from "~/lib/useForm";

type Props = FormHTMLAttributes<HTMLFormElement> & {
  form: any;
};

export function Form({ form, children, ...props }: Props) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (form.parse()) {
      props.onSubmit?.(event);
    }
  };

  return (
    <form {...props} onSubmit={onSubmit}>
      <Context.Provider value={form}>{children}</Context.Provider>
    </form>
  );
}
