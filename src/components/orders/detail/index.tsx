"use client";

import { type UseShowProps, useShow } from "@refinedev/core";
import { useLayoutEffect } from "react";
import JSConfetti from "js-confetti";
import { OrderIcon } from "@/components/icons";
import { TRANSLATIONS_THANKS } from "@/utils/constants";
import type { Order } from "@/types";
import dayjs from "dayjs";

type OrderPageProps = {
  orderId: Order["id"];
};

export const OrderDetail: React.FC<OrderPageProps> = ({ orderId }) => {
  const { query: queryResult } = useShow<Order>({
    resource: "orders",
    id: orderId,
  });
  const order = queryResult.data?.data;

  useLayoutEffect(() => {
    const jsConfetti = new JSConfetti();
    setTimeout(() => {
      jsConfetti.addConfetti();
    }, 500);
  }, []);

  if (!order) {
    return null;
  }

  return (
    <div className="container mt-8 overflow-hidden rounded-xl bg-white">
      <div className="flex flex-wrap items-center justify-center  gap-4 bg-green-600 p-4 text-white sm:justify-start">
        <OrderIcon />
        <h1 className="main-title text-center text-2xl font-bold uppercase">
          Заказ оформлен
        </h1>
      </div>
      <div className="p-4">
        <h1 className="text-3xl font-bold text-gray-800">Детали заказа</h1>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-16">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-bold text-gray-700">Номер:</h4>
              <p>#{order.orderNumber}</p>
            </div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-bold text-gray-700">Дата:</h4>
              <p>{dayjs(order.createdAt).format("DD.MM.YYYY HH:mm")}</p>
            </div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-bold text-gray-700">Стоимость:</h4>
              <p>{order.products.reduce((a, b) => a + b.price, 0)}&nbsp;₽</p>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-700">Состав</h4>
            {order.products.map((product, index) => (
              <p key={product.id}>
                {index + 1}. {product.name}
              </p>
            ))}
          </div>
        </div>
      </div>
      <hr />
      <div className="flex flex-wrap items-center justify-start gap-1 p-8 opacity-50 md:justify-center text-md font-semibold uppercase">
        {TRANSLATIONS_THANKS.join(" ")}
        {/* {TRANSLATIONS_THANKS.map((p, index) => (
          <span
            key={p}
            className="text-md uppercase"
            style={{
              fontWeight: index % 2 === 0 ? 800 : 500,
            }}
          >
            {p}
          </span>
        ))} */}
      </div>
    </div>
  );
};
