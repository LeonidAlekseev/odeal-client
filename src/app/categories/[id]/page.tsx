"use client";

import React, { Suspense } from "react";
import { useList } from "@refinedev/core";
import type { Category } from "@/types";
import { ProductsTable } from "@/components/products/table";
import { CategoriesNavLinks } from "@/components/categories";
import { ProductsTableSkeleton } from "@/components/products/table";

type CategoryShowPageProps = {
  params: { id: string };
};

export default function CategoryShowPage({ params }: CategoryShowPageProps) {
  const { data: categoriesData } = useList<Category>({
    resource: "categories",
    pagination: {
      mode: "off",
    },
  });
  const categories = categoriesData?.data ?? [];

  return (
    <>
      <CategoriesNavLinks
        categories={categories}
        selectedCategoryId={params.id}
      />
      <Suspense fallback={<ProductsTableSkeleton />}>
        <ProductsTable categoryId={parseInt(params.id)} />
      </Suspense>
    </>
  );
}
