"use client";

import type { Application, Provider } from "@prisma/client";
import { useFormState } from "react-dom";

import { Alert } from "~/src/components/Alert";
import { Button } from "~/src/components/Button";
import { Field } from "~/src/components/Field";
import { Flex } from "~/src/components/Flex";
import { Icon } from "~/src/components/Icon";
import { Input } from "~/src/components/Input";
import { Select } from "~/src/components/Select";
import { Submit } from "~/src/components/Submit";
import { useAutoFocus } from "~/src/lib/client/autoFocus";
import { Props as FormProps } from "~/src/lib/server/form";
import { getPublicId } from "~/src/lib/shared/publicId";

type Props = FormProps & {
  context: {
    applications: Application[];
    providers: Provider[];
  };
  destroy?: () => Promise<void>;
  cancelUrl?: string;
};

export function Form({ context, destroy, ...props }: Props) {
  const [state, action] = useFormState(props.action, props.initialState);
  const autoFocusRef = useAutoFocus();

  return (
    <Flex as="form" action={action} direction="column" gap="3rem">
      {state.message ? (
        <Alert variant={state.status ?? "neutral"}>
          <p>{state.message}</p>
        </Alert>
      ) : null}

      <Flex as="fieldset" direction="column" gap="1.5rem">
        <Field
          label="Name"
          hint="Name, role, or function this relation performs."
        >
          {(props) => (
            <Input
              name="name"
              placeholder="e.g. Database"
              required
              minLength={1}
              defaultValue={state.values?.name}
              {...props}
              ref={autoFocusRef}
            />
          )}
        </Field>

        <Field label="URL" hint="URL address for this relation.">
          {(props) => (
            <Input
              type="url"
              name="url"
              placeholder="e.g. https://db.example.com"
              defaultValue={state.values?.url}
              {...props}
            />
          )}
        </Field>

        <Field
          label="Subject"
          hint="The resource that is supported by this relation."
        >
          {(props) => (
            <Select
              name="relator"
              {...props}
              defaultValue={state.values?.relator}
            >
              <option value="">e.g. Web application</option>
              <optgroup label="Applications">
                {context.applications.map((application) => (
                  <option
                    key={getPublicId(application)}
                    value={JSON.stringify({
                      applicationId: getPublicId(application),
                    })}
                  >
                    {application.name}
                  </option>
                ))}
              </optgroup>
            </Select>
          )}
        </Field>

        <Field label="Related" hint="The resource the supports the subject.">
          {(props) => (
            <Select
              name="relatable"
              {...props}
              defaultValue={state.values?.relatable}
            >
              <option value="">e.g. Web application</option>
              <optgroup label="Applications">
                {context.applications.map((application) => (
                  <option
                    key={getPublicId(application)}
                    value={JSON.stringify({
                      applicationId: getPublicId(application),
                    })}
                  >
                    {application.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Providers">
                {context.providers.map((provider) => (
                  <option
                    key={getPublicId(provider)}
                    value={JSON.stringify({
                      providerId: getPublicId(provider),
                    })}
                  >
                    {provider.name}
                  </option>
                ))}
              </optgroup>
            </Select>
          )}
        </Field>
      </Flex>

      <Flex as="footer" justifyContent="space-between">
        <Flex gap="0.5rem" style={{ marginInlineStart: "auto" }}>
          {destroy ? (
            <Button action={destroy} variant="negative">
              Delete <Icon variant="trash" />
            </Button>
          ) : null}

          <Submit>Save</Submit>
        </Flex>
      </Flex>
    </Flex>
  );
}
