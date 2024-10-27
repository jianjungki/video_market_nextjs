// webhooks/orders_create.js
export default async function ordersCreateHandler(topic, shop, body) {
  const order = JSON.parse(body);
  console.log("New order created:", order.id);
  console.log("order info:", JSON.stringify(order));
  // Process each line item in the order
  for (const item of order.line_items) {
    // Here you would typically update your local inventory
    // For example:
    // await updateLocalInventory(item.product_id, item.variant_id, item.quantity);
  }

  return { success: true };
}
