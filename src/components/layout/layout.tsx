"use client";

import React from "react";
import type { LayoutProps } from "@refinedev/core";
import { OrdersModal } from "@/components/orders";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { useOrdesModalContext } from "@/hooks/useOrdersModalContext";

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { ordersModalVisible } = useOrdesModalContext();

  return (
    <>
      <div className="grid min-h-screen grid-rows-[64px_1fr_auto]">
        <Header />
        <main className="bg-primary px-2 lg:px-0 overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </div>
      {ordersModalVisible && <OrdersModal />}
    </>
  );
};
