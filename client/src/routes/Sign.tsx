import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { Alert } from "~/src/components/Alert";
import { Button } from "~/src/components/Button";
import { Field } from "~/src/components/Field";
import { Input } from "~/src/components/Input";
import type { Session } from "~/src/lib/api";
import { request } from "~/src/lib/request";

export default function Page() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const {
    mutate: signIn,
    error,
    isPending,
  } = useMutation({
    mutationFn(data: FormData) {
      return request<Session>("/api/v1/sessions", {
        body: data,
      });
    },
    async onSuccess() {
      await queryClient.invalidateQueries();
      setLocation("/");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    signIn(data);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-12">
      <form
        onSubmit={handleSubmit}
        aria-busy={isPending}
        className="flex flex-col gap-9 w-80"
      >
        <legend className="text-2xl font-bold">Sign in</legend>

        <Alert error={error} />

        <p>
          Haven't joined yet?{" "}
          <Link href="/join" className="font-bold underline">
            Create a new account
          </Link>
          .
        </p>

        <fieldset className="flex flex-col gap-6">
          <Field label="E-mail">
            {({ id }) => (
              <Input
                type="email"
                id={id}
                name="email"
                placeholder="e.g. warren@example.com"
                required
              />
            )}
          </Field>

          <Field label="Password">
            {({ id }) => (
              <Input
                type="password"
                id={id}
                name="password"
                placeholder="e.g. ************"
                required
                minLength={12}
              />
            )}
          </Field>
        </fieldset>

        <footer>
          <Button type="submit" disabled={isPending}>
            Sign in
          </Button>
        </footer>
      </form>
    </div>
  );
}
