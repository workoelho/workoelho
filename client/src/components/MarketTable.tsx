import { useQuery } from "@tanstack/react-query";
import { Button } from "~/src/components/Button";
import type { Order, Portfolio } from "~/src/lib/api";
import { fmt } from "~/src/lib/format";
import { request } from "~/src/lib/request";

type Props = {
  prefillPostForm(
    order: Pick<Order, "type" | "stockId" | "shares" | "price">,
  ): void;
};

export function MarketTable({ prefillPostForm }: Props) {
  const { data: portfolioId, isSuccess: isPortfolioLoaded } = useQuery({
    queryKey: ["portfolioId"],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn({ signal }) {
      return request<Portfolio>("/api/v1/portfolio", { signal });
    },
    select(response) {
      return response.body.id;
    },
  });

  const { data: market } = useQuery({
    queryKey: ["orders", { hide: portfolioId, status: "pending" }] as const,
    queryFn({ signal, queryKey: [, query] }) {
      return request<Order[]>(
        `/api/v1/orders?hide=${portfolioId}&status=pending`,
        {
          query,
          signal,
        },
      );
    },
    select(response) {
      return response.body;
    },
    refetchInterval: 2000,
    enabled: isPortfolioLoaded,
  });

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="p-2 text-left border-zinc-700">Order</th>
          <th className="p-2 text-left border-l border-zinc-700">Stock</th>
          <th className="p-2 text-right border-l border-zinc-700">Shares</th>
          <th className="p-2 text-right border-l border-zinc-700">Price</th>
          <th className="p-2 text-right border-l border-zinc-700">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {market?.map((order) => (
          <tr key={order.id} className="border-t border-zinc-700">
            <td className="p-2 border-zinc-700">
              {fmt.capitalize(order.type)}
            </td>
            <td className="p-2 border-l border-zinc-700">{order.stock.name}</td>
            <td className="p-2 text-right border-l border-zinc-700">
              {fmt.number(order.remaining)}
            </td>
            <td className="p-2 text-right border-l border-zinc-700">
              {fmt.currency(order.price)}
            </td>
            <td className="p-2 text-center border-l border-zinc-700">
              <Button
                variant="small"
                onClick={() =>
                  prefillPostForm({
                    stockId: order.stock.id,
                    type: order.type === "ask" ? "bid" : "ask",
                    shares: order.remaining,
                    price: order.price,
                  })
                }
              >
                {order.type === "ask" ? "Bid" : "Ask"}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
