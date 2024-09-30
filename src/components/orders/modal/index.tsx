"use client";
import { useRef } from "react";
import { useCreate, useGo } from "@refinedev/core";
import { CloseIcon, OrderIcon } from "@/components/icons";
import { useOrdesModalContext } from "@/hooks/useOrdersModalContext";
import { useBasketContext } from "@/hooks/useBasketContext";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import type { Order } from "@/types";

export const OrdersModal: React.FC = () => {
  const ref = useRef(null);
  const go = useGo();
  const { setOrdersModalVisible } = useOrdesModalContext();
  const { orders, totalPrice, products, dispatch } = useBasketContext();
  const { mutate } = useCreate<Order>({
    resource: "orders",
    successNotification: false,
    mutationOptions: {
      onSuccess: (data) => {
        go({
          to: {
            resource: "orders",
            id: data.data.id,
            action: "show",
          },
          type: "replace",
        });
        setOrdersModalVisible(false);
        dispatch({
          type: "resetBasket",
        });
      },
    },
  });

  const handleClickOutside = () => {
    setOrdersModalVisible(false);
  };
  useOnClickOutside(ref, handleClickOutside);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black opacity-40" />
      <div className="fixed inset-0 z-50 flex items-center">
        <div
          ref={ref}
          className="mx-auto max-h-[95%] max-w-[500px] w-full p-2 "
        >
          <div className="overflow-auto rounded-lg bg-white shadow-lg">
            <div className="bg-primary flex justify-between p-4">
              <div className="flex gap-4 items-center">
                <OrderIcon />
                <span className="text-xl font-bold text-white uppercase">
                  Оформление заказа
                </span>
              </div>
              <button
                className="transition-all hover:bg-orange-500 active:scale-90 rounded-md"
                onClick={() => setOrdersModalVisible(false)}
              >
                <CloseIcon className="h-8 w-8 text-white" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex flex-col gap-2">
                {orders.length ? (
                  orders.map((order) => {
                    const { productId } = order;
                    const product = products.find((p) => p.id === productId);
                    return (
                      <div
                        key={order.productId}
                        className="grid grid-cols-8 items-center border-b pb-4"
                      >
                        <div className="col-span-5 flex items-center gap-2">
                          <img
                            className="h-12 w-12 rounded-md object-cover object-center"
                            src={product?.images[0].url}
                            alt={product?.name}
                          />
                          <p className="font-semibold">{product?.name}</p>
                        </div>
                        <div className="col-span-2 flex-none">
                          <span className="font-semibold">
                            ₽{product?.price ?? 0}
                          </span>
                        </div>
                        <button
                          className="col-span-1 justify-self-end transition-all hover:bg-orange-500 active:scale-90 rounded-md"
                          onClick={() =>
                            dispatch({
                              type: "delProduct",
                              payload: { productId: productId },
                            })
                          }
                        >
                          <CloseIcon className="h-5 w-5" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="flex h-48 items-center justify-center text-xl font-bold text-gray-500">
                    Корзина пуста.
                  </p>
                )}
              </div>
              {orders.length && (
                <div className="mt-2 flex flex-col items-end gap-4">
                  <div className="flex items-center justify-center gap-2">
                    Итого:
                    <span className="text-lg font-bold text-gray-800">
                      {orders.length} / ₽{totalPrice}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      mutate({
                        values: {
                          products,
                          amount: totalPrice,
                        },
                      })
                    }
                    className="bg-primary border-primary rounded-md border px-4 text-lg font-bold text-white transition-all hover:bg-orange-500 active:scale-95"
                  >
                    Заказать
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
