// components/ProductForm.tsx
import React, { useState, useCallback } from "react";
import { useRouter } from "next/router";
import {
  Card,
  Form,
  FormLayout,
  TextField,
  Button,
  Stack,
} from "@shopify/polaris";

export default function ProductForm({ product }) {
  const [externalId, setExternalId] = useState(product.externalId || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ externalId }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/products");
    }
  }, [externalId, product.id, router]);

  const handleExternalIdChange = useCallback(
    (value) => setExternalId(value),
    []
  );

  return (
    <Card sectioned>
      <Form onSubmit={handleSubmit}>
        <FormLayout>
          <TextField
            label="External ID"
            value={externalId}
            onChange={handleExternalIdChange}
            autoComplete="off"
          />
          <Stack distribution="trailing">
            <Button primary submit loading={loading}>
              Save
            </Button>
          </Stack>
        </FormLayout>
      </Form>
    </Card>
  );
}
