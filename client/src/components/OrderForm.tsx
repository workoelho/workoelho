import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { Alert } from "~/src/components/Alert";
import { Button } from "~/src/components/Button";
import { Field } from "~/src/components/Field";
import { Input } from "~/src/components/Input";
import { Select } from "~/src/components/Select";
import type { Order, Stock } from "~/src/lib/api";
import { request } from "~/src/lib/request";

type Props = {
  formRef: React.RefObject<HTMLFormElement>;
};

export function OrderForm({ formRef }: Props) {
  const queryClient = useQueryClient();

  const {
    mutate: post,
    error,
    isPending,
  } = useMutation({
    mutationFn: (data: FormData) => {
      return request<Order>("/api/v1/orders", {
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });

      formRef.current?.reset();
    },
  });

  const {
    data: { body: stocks = [] } = {},
    isLoading: isLoadingStocks,
  } = useQuery({
    queryKey: ["stocks"],
    queryFn: ({ signal }) => {
      return request<Stock[]>("/api/v1/stocks", { signal });
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    post(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={isPending}
      className="flex flex-col gap-9"
      ref={formRef}
    >
      <Alert error={error} />

      <fieldset className="flex flex-col gap-6">
        <input type="hidden" name="portfolioId" />

        <div className="grid grid-cols-2 gap-6">
          <Field label="Type">
            {({ id }) => (
              <Select id={id} name="type" required>
                <option value="" className="hidden">
                  e.g. Ask
                </option>
                <option value="bid">Bid</option>
                <option value="ask">Ask</option>
              </Select>
            )}
          </Field>

          <Field label="Stock">
            {({ id }) => (
              <Select id={id} name="stockId" required>
                {isLoadingStocks ? (
                  <option value="">Loading...</option>
                ) : (
                  [
                    <option key="placeholder" value="">
                      e.g. Stock Co.
                    </option>,
                    ...stocks.map((stock) => (
                      <option key={stock.id} value={stock.id}>
                        {stock.name}
                      </option>
                    )),
                  ]
                )}
              </Select>
            )}
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Field label="Shares">
            {({ id }) => (
              <Input
                type="number"
                id={id}
                name="shares"
                placeholder="e.g. 99"
              />
            )}
          </Field>

          <Field label="Price">
            {({ id }) => (
              <Input
                type="number"
                id={id}
                name="price"
                placeholder="e.g. 999"
              />
            )}
          </Field>
        </div>
      </fieldset>

      <footer>
        <Button type="submit" disabled={isPending}>
          Post
        </Button>
      </footer>
    </form>
  );
}
