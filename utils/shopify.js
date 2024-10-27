import { LogSeverity, shopifyApi } from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/node";
import appUninstallHandler from "./webhooks/app_uninstalled.js";
import inventoryLevelsUpdateHandler from "./webhooks/inventory_levels_update.js";
import ordersCreateHandler from "./webhooks/orders_create.js";

const isDev = process.env.NODE_ENV === "development";

// Setup Shopify configuration
let shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SHOPIFY_API_SCOPES,
  hostName: process.env.SHOPIFY_APP_URL.replace(/https:\/\//, ""),
  hostScheme: "https",
  apiVersion: process.env.SHOPIFY_API_VERSION,
  isEmbeddedApp: true,
  logger: { level: isDev ? LogSeverity.Info : LogSeverity.Error },
});

shopify = {
  ...shopify,
  user: {
    /**
     * @type {Array<{
     *   topics: string[],
     *   url: string,
     *   callback: Function,
     *   filter?: string,
     *   include_fields?: string[]
     * }>}
     */
    webhooks: [
      {
        topics: ["app/uninstalled"],
        url: "/api/webhooks/app_uninstalled",
        callback: appUninstallHandler,
      },
      {
        topics: ["inventory_levels/update"],
        url: "/api/webhooks/inventory_levels_update",
        callback: inventoryLevelsUpdateHandler,
      },
      {
        topics: ["orders/create"],
        url: "/api/webhooks/orders_create",
        callback: ordersCreateHandler,
      },
    ],
  },
};

// Existing syncInventory function
shopify.syncInventory = async function (
  session,
  productId,
  variantId,
  newQuantity
) {
  const client = new shopify.clients.Rest({ session });

  try {
    const response = await client.post({
      path: "inventory_levels/set",
      data: {
        location_id: process.env.SHOPIFY_LOCATION_ID,
        inventory_item_id: variantId,
        available: newQuantity,
      },
    });

    console.log("Inventory synced successfully:", response.body);
    return response.body;
  } catch (error) {
    console.error("Error syncing inventory:", error);
    throw error;
  }
};

// New syncOrder function
shopify.syncOrder = async function (session, orderId) {
  const client = new shopify.clients.Rest({ session });

  try {
    // Fetch the order details
    const orderResponse = await client.get({
      path: `orders/${orderId}`,
    });

    const order = orderResponse.body.order;

    // Process each line item in the order
    for (const item of order.line_items) {
      // Fetch current inventory levels
      const inventoryResponse = await client.get({
        path: `inventory_levels`,
        query: {
          inventory_item_ids: item.variant_id,
          location_ids: process.env.SHOPIFY_LOCATION_ID,
        },
      });

      const currentInventory = inventoryResponse.body.inventory_levels[0];

      // Calculate new inventory level
      const newQuantity = currentInventory.available - item.quantity;

      // Update inventory
      await shopify.syncInventory(
        session,
        item.product_id,
        item.variant_id,
        newQuantity
      );
    }

    console.log("Order synced successfully:", orderId);
    return { success: true, orderId };
  } catch (error) {
    console.error("Error syncing order:", error);
    throw error;
  }
};

export default shopify;
