"use client";

import { useTable } from "@refinedev/core";
import cn from "classnames";
import { useIsClient } from "usehooks-ts";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { useBasketContext } from "@/hooks/useBasketContext";
import type { Category, Product } from "@/types";
import { MEDIA_API_URL } from "@/utils/constants";

type Props = {
  categoryId: Category["id"];
};

export const ProductsTable = ({ categoryId }: Props) => {
  const isClient = useIsClient();

  const { tableQuery, current, setCurrent, pageSize, setPageSize, pageCount } =
    useTable<Product>({
      resource: "products",
      syncWithLocation: true,
      initialPageSize: 6,
      filters: {
        initial: [
          {
            field: "category.id",
            operator: "eq",
            value: categoryId,
          },
        ],
      },
      meta: {
        populate: ["images"],
      },
    });
  const products = tableQuery?.data?.data ?? [];
  const hasNext = current < pageCount;
  const hasPrev = current > 1;

  return (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 overflow-hidden">
        {products.map((product) => {
          return (
            <div
              key={product.id}
              className="h-full bg-primary/10 rounded-2xl p-4"
            >
              <div className="h-full flex flex-col items-stretch items-center gap-4">
                <img
                  className="h-32 w-full flex-none rounded-xl object-cover"
                  src={`${MEDIA_API_URL}${product.images[0]?.url}`}
                  alt={product.name}
                />
                <div className="h-full flex flex-col items-center justify-between gap-4">
                  <div className="w-full flex flex-col text-left gap-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-gray-600">{product.description}</p>
                  </div>
                  <div className="w-full flex flex-row justify-between">
                    <div className="w-16 text-lg font-bold text-gray-800">
                      {product.price}&nbsp;₽
                    </div>
                    <div>
                      {isClient && <OrderInput productId={product.id} />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pb-4 px-4 gap-2">
        <button
          className="border rounded-md px-2 py-2 text-sm font-medium hover:bg-gray-50"
          onClick={() => setCurrent((prev) => prev - 1)}
          disabled={!hasPrev}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        {[...Array(pageCount)].map((_, page) => (
          <button
            key={page}
            className={`border rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50 ${
              current === page ? "text-primary" : ""
            }`}
            onClick={() => setCurrent(page + 1)}
          >
            {page + 1}
          </button>
        ))}
        <button
          className="border rounded-md px-2 py-2 text-sm font-medium hover:bg-gray-50"
          onClick={() => setCurrent((prev) => prev + 1)}
          disabled={!hasNext}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </>
  );
};

const OrderInput = ({ productId }: { productId: Product["id"] }) => {
  const { dispatch, findOrderByProductId } = useBasketContext();

  const order = findOrderByProductId(productId);

  return (
    <div className="flex shrink-0 gap-4">
      <button
        className={cn(
          "bg-primary flex h-8 items-center gap-1 rounded-lg px-4",
          "font-bold text-white whitespace-nowrap",
          "transition-all hover:bg-orange-500 active:scale-95"
        )}
        onClick={() => {
          !order
            ? dispatch({
                type: "addProduct",
                payload: { productId: productId },
              })
            : dispatch({
                type: "delProduct",
                payload: { productId: productId },
              });
        }}
      >
        {!order ? "В корзину" : "Удалить"}
      </button>
    </div>
  );
};
