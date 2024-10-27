// components/Layout.tsx
import React from "react";
import { Frame, Navigation } from "@shopify/polaris";
import { HomeMinor, ProductsMinor, OrdersMinor } from "@shopify/polaris-icons";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const router = useRouter();

  const navigationMarkup = (
    <Navigation location={router.pathname}>
      <Navigation.Section
        items={[
          {
            label: "Home",
            icon: HomeMinor,
            url: "/",
          },
          {
            label: "Products",
            icon: ProductsMinor,
            url: "/products",
          },
          {
            label: "Orders",
            icon: OrdersMinor,
            url: "/orders",
          },
        ]}
      />
    </Navigation>
  );

  return <Frame navigation={navigationMarkup}>{children}</Frame>;
}
