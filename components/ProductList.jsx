// components/ProductList.tsx
import React from "react";
import {
  Card,
  ResourceList,
  ResourceItem,
  TextStyle,
  Thumbnail,
} from "@shopify/polaris";
import { ImageMajor } from "@shopify/polaris-icons";

export default function ProductList({ products }) {
  return (
    <Card>
      <ResourceList
        resourceName={{ singular: "Product", plural: "Products" }}
        items={products}
        renderItem={(product) => (
          <ResourceItem
            id={product.id}
            url={`/products/${product.id}`}
            media={
              <Thumbnail
                source={product.images[0]?.src || ImageMajor}
                alt={product.title}
              />
            }
            accessibilityLabel={`View details for ${product.title}`}
          >
            <h3>
              <TextStyle variation="strong">{product.title}</TextStyle>
            </h3>
            <div>SKU: {product.variants[0].sku}</div>
            <div>Inventory: {product.variants[0].inventory_quantity}</div>
          </ResourceItem>
        )}
      />
    </Card>
  );
}
