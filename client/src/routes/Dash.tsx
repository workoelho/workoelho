import { useQuery } from "@tanstack/react-query";
import { useLayoutEffect, useRef } from "react";
import { BalanceTable } from "~/src/components/BalanceTable";
import { Button } from "~/src/components/Button";
import { Header } from "~/src/components/Header";
import { MarketTable } from "~/src/components/MarketTable";
import { Modal } from "~/src/components/Modal";
import { OrderForm } from "~/src/components/OrderForm";
import { OrdersTable } from "~/src/components/OrdersTable";
import { PortfolioTable } from "~/src/components/PortfolioTable";
import type { Order, Portfolio } from "~/src/lib/api";
import { request } from "~/src/lib/request";

export default function Page() {
  const postDialogRef = useRef<HTMLDialogElement>(null);
  const postFormRef = useRef<HTMLFormElement>(null);

  const { data: portfolioId } = useQuery({
    queryKey: ["portfolioId"],
    queryFn({ signal }) {
      return request<Portfolio>("/api/v1/portfolio", { signal });
    },
    select(response) {
      return response.body.id;
    },
    staleTime: Number.POSITIVE_INFINITY,
  });

  useLayoutEffect(() => {
    if (!postFormRef.current) {
      throw new Error("Can't set portfolioId");
    }

    const controls = postFormRef.current.elements as unknown as {
      portfolioId: HTMLInputElement;
    };

    controls.portfolioId.value = String(portfolioId);
  }, [portfolioId]);

  const prefillPostForm = (
    order: Pick<Order, "type" | "stockId" | "shares" | "price">,
  ) => {
    if (!postFormRef.current) {
      return;
    }

    if (!postDialogRef.current) {
      return;
    }

    const controls = postFormRef.current.elements as unknown as {
      type: HTMLSelectElement;
      stockId: HTMLInputElement;
      shares: HTMLInputElement;
      price: HTMLInputElement;
    };

    controls.type.value = order.type;
    controls.stockId.value = String(order.stockId);
    controls.shares.value = String(order.shares);
    controls.price.value = String(order.price);

    postDialogRef.current.showModal();
  };

  return (
    <div className="container grid grid-cols-2 gap-12 px-12 py-6 mx-auto">
      <div className="flex flex-col gap-12">
        <section className="flex flex-col gap-3">
          <Header title="Balance" />

          <BalanceTable />
        </section>

        <section className="flex flex-col gap-3">
          <Header title="Portfolio">
            <menu>
              <li>
                <Button
                  onClick={() => {
                    postDialogRef.current?.showModal();
                  }}
                >
                  Post order
                </Button>
              </li>
            </menu>
          </Header>

          <PortfolioTable prefillPostForm={prefillPostForm} />
        </section>

        <section className="flex flex-col gap-3">
          <Header title="My orders" />

          <OrdersTable />
        </section>
      </div>

      <div className="flex flex-col gap-12">
        <section className="flex flex-col gap-3">
          <Header title="Market" />

          <MarketTable prefillPostForm={prefillPostForm} />
        </section>

        <Modal dialog={postDialogRef}>
          <div className="flex flex-col gap-6">
            <Header title="Post order">
              <Button onClick={() => postDialogRef.current?.close()}>
                Close
              </Button>
            </Header>

            <OrderForm formRef={postFormRef} />
          </div>
        </Modal>
      </div>
    </div>
  );
}
