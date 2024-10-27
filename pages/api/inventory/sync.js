import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware.js";

/**
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
const handler = async (req, res) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { client } = await clientProvider.offline.graphqlClient({
      shop: req.user_shop,
    });

    const { inventoryItemId, availableQuantity, locationId } = req.body;

    if (!inventoryItemId || availableQuantity === undefined || !locationId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const query = `
      mutation inventoryAdjustQuantity($input: InventoryAdjustQuantityInput!) {
        inventoryAdjustQuantity(input: $input) {
          inventoryLevel {
            available
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        inventoryItemId,
        availableDelta: availableQuantity,
        locationId,
      },
    };

    const response = await client.query({
      data: {
        query,
        variables,
      },
    });

    if (response.body.data.inventoryAdjustQuantity.userErrors.length > 0) {
      const errors = response.body.data.inventoryAdjustQuantity.userErrors;
      return res.status(400).json({ errors });
    }

    const updatedInventory =
      response.body.data.inventoryAdjustQuantity.inventoryLevel;

    return res.status(200).json({
      message: "Inventory synced successfully",
      updatedInventory,
    });
  } catch (error) {
    console.error("Error syncing inventory:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while syncing inventory" });
  }
};

export default withMiddleware("verifyProxy")(handler);
