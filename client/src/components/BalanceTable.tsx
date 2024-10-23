import { useQuery } from "@tanstack/react-query";
import type { Portfolio } from "~/src/lib/api";
import { fmt } from "~/src/lib/format";
import { request } from "~/src/lib/request";

export function BalanceTable() {
  const { data: portfolio } = useQuery({
    queryKey: ["portfolioId"],
    queryFn({ signal }) {
      return request<Portfolio>("/api/v1/portfolio", { signal });
    },
    select(response) {
      return response.body;
    },
    refetchInterval: 2000,
  });

  return (
    <table className="w-full border-collapse">
      <tbody>
        <tr>
          <th className="p-2 text-left">Holdings</th>
          <td className="p-2 border-l border-zinc-700">
            {portfolio
              ? fmt.currency(portfolio.total - portfolio.balance)
              : "Loading..."}
          </td>
        </tr>
        <tr className="border-t border-zinc-700">
          <th className="p-2 text-left">Liquid</th>
          <td className="p-2 border-l border-zinc-700">
            {portfolio ? fmt.currency(portfolio.balance) : "Loading..."}
          </td>
        </tr>
        <tr className="border-t border-zinc-700">
          <th className="p-2 text-left">Total</th>
          <td className="p-2 border-l border-zinc-700">
            {portfolio ? fmt.currency(portfolio.total) : "Loading..."}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
