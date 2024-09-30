import { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";
import { Layout } from "@/components/layout";
import { BasketContextProvider } from "@/context";
import { dataProvider } from "@/providers/data-provider/client";
import "src/styles/globals.css";

export const metadata: Metadata = {
  title: "odeal - это легко!",
  description: "Разработано для Код Согласия",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const lang = cookieStore.get("NEXT_LOCALE");

  return (
    <>
      <html lang={lang?.value || "ru"}>
        <body className="bg-primary">
          <Suspense>
            <Refine
              resources={[
                {
                  name: "categories",
                  show: "/categories/:id",
                },
                {
                  name: "orders",
                  show: "/orders/:id",
                },
              ]}
              routerProvider={routerProvider}
              dataProvider={dataProvider}
            >
              <BasketContextProvider>
                <Layout>{children}</Layout>
              </BasketContextProvider>
            </Refine>
          </Suspense>
        </body>
      </html>
    </>
  );
}
