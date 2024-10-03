"use client";

import React from "react";
import { useOne } from "@refinedev/core";
import { redirect } from "next/navigation";
import { OrderDetail } from "@/components/orders";
import type { Order } from "@/types";

type OrderShowPagePageProps = {
  params: { id: string };
};

export default function OrderShowPage({ params }: OrderShowPagePageProps) {
  const { data: orderData } = useOne<Order>({
    resource: "categories",
    id: parseInt(params.id),
  });

  if (!orderData?.data) {
    return redirect("/");
  }

  return <OrderDetail orderId={parseInt(params.id)} />;
}
