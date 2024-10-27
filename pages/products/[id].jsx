// pages/products/[id].tsx
import React from "react";
import { useRouter } from "next/router";
import { Page, Layout, Card, SkeletonBodyText } from "@shopify/polaris";
import ProductForm from "../../components/ProductForm";
import AppLayout from "../../components/Layout";

export default function ProductPage({ product }) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <AppLayout>
        <Page title="Loading...">
          <Layout>
            <Layout.Section>
              <Card sectioned>
                <SkeletonBodyText />
              </Card>
            </Layout.Section>
          </Layout>
        </Page>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Page
        breadcrumbs={[{ content: "Products", url: "/products" }]}
        title={product.title}
      >
        <Layout>
          <Layout.Section>
            <ProductForm product={product} />
          </Layout.Section>
          <Layout.Section secondary>
            <Card title="Inventory" sectioned>
              <p>Available: {product.variants[0].inventory_quantity}</p>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </AppLayout>
  );
}

export async function getServerSideProps({ params }) {
  // Fetch product data from Shopify API
  const product = await fetchProductById(params.id);
  return { props: { product } };
}
