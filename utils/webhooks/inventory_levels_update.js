// webhooks/inventory_levels_update.js
export default async function inventoryLevelsUpdateHandler(topic, shop, body) {
  const inventory_item = JSON.parse(body);
  console.log("Inventory updated:", inventory_item);

  // Here you would typically update your local database or perform any other necessary actions
  // For example:
  // await updateLocalInventory(inventory_item.inventory_item_id, inventory_item.available);

  return { success: true };
}
