"use client";

import React, {
  createContext,
  type PropsWithChildren,
  useReducer,
} from "react";
import { useMany } from "@refinedev/core";
import { useLocalStorage } from "usehooks-ts";
import { OrdersModalContextProvider } from "@/context";
import type { BasketOrder, Product } from "../types";

export const BasketContext = createContext<{
  orders: BasketOrder[];
  findOrderByProductId: (productId: number) => BasketOrder | undefined;
  dispatch: Function;
  totalPrice: number;
  products: Product[];
}>({
  orders: [],
  findOrderByProductId: () => undefined,
  dispatch: () => null,
  totalPrice: 0,
  products: [],
});

const initialBasket: BasketOrder[] = [];

const basketReducer = (
  state: BasketOrder[],
  action: {
    payload: BasketOrder;
    type: string;
  }
): BasketOrder[] => {
  switch (action.type) {
    case "addProduct": {
      // const currentOrder = state.find(
      //   (order) => order.productId === action.payload.productId
      // );

      // if (currentOrder) {
      //   return state.map((order) =>
      //     order.productId === action.payload.productId ? order: order
      //   );
      // }

      return [...state, action.payload];
    }

    case "delProduct": {
      const currentOrder = state.find(
        (order) => order.productId === action.payload.productId
      );

      if (currentOrder) {
        return state.filter(
          (order) => order.productId !== action.payload.productId
        );
      }

      return [...state, action.payload];
    }

    case "resetBasket":
      return [];
    default:
      return [];
  }
};
export const BasketContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [ordersLS, setOrdersLS, removeOrdersLS] = useLocalStorage(
    "basket-order",
    initialBasket
  );
  const [orders, dispatch] = useReducer(basketReducer, ordersLS);
  const isBasketHaveOrders = orders.length > 0;

  React.useEffect(() => {
    setOrdersLS(orders);
  }, [orders]);

  const productIds = orders
    .map((o) => o.productId)
    .filter((value, index, array) => array.indexOf(value) === index);

  const { data: productsData } = useMany<Product>({
    resource: "products",
    ids: productIds,
    queryOptions: {
      enabled: isBasketHaveOrders,
    },
  });

  const totalPrice = orders.reduce((total, currentValue) => {
    const product = productsData?.data.find(
      (value) => value.id === currentValue.productId
    );

    return total + (product?.price ?? 0);
  }, 0);

  const findOrderByProductId = (productId: number) => {
    return orders.find((order) => order.productId === productId);
  };

  return (
    <BasketContext.Provider
      value={{
        orders,
        findOrderByProductId,
        dispatch,
        totalPrice,
        products: productsData?.data ?? [],
      }}
    >
      <OrdersModalContextProvider>{children}</OrdersModalContextProvider>
    </BasketContext.Provider>
  );
};
