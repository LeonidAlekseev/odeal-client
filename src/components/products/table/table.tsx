"use client";

import { useMemo } from "react";
import type { HttpError, useTableProps } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import cn from "classnames";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  PlusSquareIcon,
} from "@/components/icons";
import { useIsClient } from "usehooks-ts";
import { useBasketContext } from "@/hooks/useBasketContext";
import type { Product } from "@/types";

type Props = {
  refineCoreProps?: Partial<useTableProps<Product, HttpError, Product>>;
};

export const ProductsTable = ({ refineCoreProps }: Props) => {
  const isClient = useIsClient();

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "product",
        accessorFn: (row) => row,
        cell: function render({ row }) {
          const product = row.original;

          return (
            <div className="w-full flex flex-col items-center gap-4 md:flex-row md:gap-8 justify-between">
              <div className="flex flex-row items-center gap-4 md:gap-8">
                <img
                  className="h-32 w-32 flex-none rounded-xl object-cover"
                  src={product.images[0].url}
                />
                <div className="flex flex-auto flex-col text-left gap-1">
                  <h3 className="text-lg font-bold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-gray-600">{product.description}</p>
                  <div className="w-16 text-lg font-bold text-gray-800">
                    ₽{product.price}
                  </div>
                </div>
              </div>
              <div className="self-end">
                {isClient && <OrderInput productId={product.id} />}
              </div>
            </div>
          );
        },
      },
    ],
    [isClient]
  );

  const {
    options: {
      state: { pagination },
    },
    getRowModel,
    setPageIndex,
    getCanPreviousPage,
    getCanNextPage,
    getPageOptions,
    nextPage,
    previousPage,
  } = useTable<Product>({
    columns,
    refineCoreProps: {
      syncWithLocation: true,
      resource: "products",
      initialPageSize: 6,
      ...(refineCoreProps || {}),
    },
  });

  return (
    <>
      <table className="w-full">
        <tbody>
          {getRowModel().rows.map((row) => {
            return (
              <tr key={row.id} className="border-b border-gray-100">
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id} className="p-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="py-4 flex justify-center px-4 gap-2">
        <button
          className="border rounded-md px-2 py-2 text-sm font-medium hover:bg-gray-50"
          onClick={() => previousPage()}
          disabled={!getCanPreviousPage()}
        >
          <ChevronLeftIcon className="text-primary h-5 w-5" />
        </button>
        {getPageOptions().map((page) => (
          <button
            key={page}
            className={`border rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50 ${
              pagination?.pageIndex === page ? "text-primary" : ""
            }`}
            onClick={() => setPageIndex(page)}
          >
            {page + 1}
          </button>
        ))}
        <button
          className="border rounded-md px-2 py-2 text-sm font-medium hover:bg-gray-50"
          onClick={() => nextPage()}
          disabled={!getCanNextPage()}
        >
          <ChevronRightIcon className="text-primary h-5 w-5" />
        </button>
      </div>
    </>
  );
};

const OrderInput = ({ productId }: { productId: number }) => {
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
