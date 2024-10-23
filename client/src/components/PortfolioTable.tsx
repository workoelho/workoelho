import { useQuery } from "@tanstack/react-query";
import { Button } from "~/src/components/Button";
import type { Holding, Order } from "~/src/lib/api";
import { fmt } from "~/src/lib/format";
import { request } from "~/src/lib/request";

type Props = {
  prefillPostForm(
    order: Pick<Order, "type" | "stockId" | "shares" | "price">,
  ): void;
};

export function PortfolioTable({ prefillPostForm }: Props) {
  const { data: holdings } = useQuery({
    queryKey: ["holdings"],
    queryFn({ signal }) {
      return request<Holding[]>("/api/v1/holdings", { signal });
    },
    select(response) {
      return response.body;
    },
    refetchInterval: 2000,
  });

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="p-2 text-left">Stock</th>
          <th className="p-2 text-right border-l border-zinc-700">Shares</th>
          <th className="p-2 text-right border-l border-zinc-700">Price</th>
          <th className="p-2 text-right border-l border-zinc-700">Total</th>
          <th className="p-2 text-right border-l border-zinc-700">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {holdings?.map((holding) => (
          <tr key={holding.id} className="border-t border-zinc-700">
            <td className="p-2">{holding.stock.name}</td>
            <td className="p-2 text-right border-l border-zinc-700">
              {fmt.number(holding.shares)}
            </td>
            <td className="p-2 text-right border-l border-zinc-700">
              {fmt.currency(holding.stock.price)}
            </td>
            <td className="p-2 text-right border-l border-zinc-700">
              {fmt.currency(holding.shares * holding.stock.price)}
            </td>
            <td className="p-2 text-right border-l border-zinc-700">
              <Button
                variant="small"
                onClick={() =>
                  prefillPostForm({
                    type: "ask",
                    stockId: holding.stockId,
                    shares: holding.shares,
                    price: holding.stock.price,
                  })
                }
              >
                Ask
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
