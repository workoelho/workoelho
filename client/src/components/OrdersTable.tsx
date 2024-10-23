import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "~/src/components/Button";
import type { Order, Portfolio } from "~/src/lib/api";
import { fmt } from "~/src/lib/format";
import { request } from "~/src/lib/request";

export function OrdersTable() {
  const queryClient = useQueryClient();

  const { mutate: cancelOrder } = useMutation({
    mutationFn(id: number) {
      return request(`/api/v1/orders/${id}`, {
        method: "delete",
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

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

  const { data: orders } = useQuery({
    queryKey: ["orders", { portfolio: portfolioId }] as const,
    queryFn({ signal, queryKey }) {
      const params = new URLSearchParams();
      params.set("portfolio", String(queryKey[1].portfolio));
      return request<Order[]>(`/api/v1/orders?${params}`, {
        signal,
      });
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
          <th className="p-2 text-left border-zinc-700">Date</th>
          <th className="p-2 text-left border-l border-zinc-700">Type</th>
          <th className="p-2 text-left border-l border-zinc-700">Stock</th>
          <th className="p-2 text-right border-l border-zinc-700">Shares</th>
          <th className="p-2 text-right border-l border-zinc-700">Price</th>
          <th className="p-2 text-right border-l border-zinc-700">Status</th>
          <th className="p-2 text-right border-l border-zinc-700">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {orders?.map((order) => (
          <tr key={order.id} className="border-t border-zinc-700">
            <td className="p-2 border-zinc-700">
              {fmt.datetime(order.createdAt)}
            </td>
            <td className="p-2 border-l border-zinc-700">
              {fmt.capitalize(order.type)}
            </td>
            <td className="p-2 truncate border-l max-w-24 border-zinc-700">
              {order.stock.name}
            </td>
            <td className="p-2 text-right border-l border-zinc-700">
              {fmt.number(order.shares)}
            </td>
            <td className="p-2 text-right border-l border-zinc-700">
              {fmt.currency(order.price)}
            </td>
            <td className="p-2 text-right border-l border-zinc-700">
              {fmt.capitalize(order.status)}
            </td>
            <td className="p-2 text-right border-l border-zinc-700">
              {order.status === "pending" ? (
                <Button variant="small" onClick={() => cancelOrder(order.id)}>
                  ✖
                </Button>
              ) : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
