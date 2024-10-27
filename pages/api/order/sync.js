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

    const { orderId } = req.body;

    if (!orderId) {
      return res
        .status(400)
        .json({ error: "Missing required parameter: orderId" });
    }

    // GraphQL query to fetch order details
    const query = `
      query getOrder($id: ID!) {
        order(id: $id) {
          id
          name
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          lineItems(first: 250) {
            edges {
              node {
                id
                quantity
                variant {
                  id
                  inventoryItem {
                    id
                    inventoryLevels(first: 1) {
                      edges {
                        node {
                          id
                          available
                          location {
                            id
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      id: orderId,
    };

    const response = await client.query({
      data: {
        query,
        variables,
      },
    });

    if (response.body.errors) {
      return res.status(400).json({ errors: response.body.errors });
    }

    const order = response.body.data.order;

    // Process each line item and update inventory
    for (const edge of order.lineItems.edges) {
      const lineItem = edge.node;
      const inventoryItemId = lineItem.variant.inventoryItem.id;
      const quantity = lineItem.quantity;
      const inventoryLevel =
        lineItem.variant.inventoryItem.inventoryLevels.edges[0]?.node;

      if (inventoryLevel) {
        const locationId = inventoryLevel.location.id;
        const availableQuantity = inventoryLevel.available - quantity;

        // Mutation to adjust inventory
        const adjustInventoryMutation = `
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

        const adjustInventoryVariables = {
          input: {
            inventoryItemId,
            availableDelta: -quantity,
            locationId,
          },
        };

        const adjustInventoryResponse = await client.query({
          data: {
            query: adjustInventoryMutation,
            variables: adjustInventoryVariables,
          },
        });

        if (
          adjustInventoryResponse.body.data.inventoryAdjustQuantity.userErrors
            .length > 0
        ) {
          console.error(
            "Error adjusting inventory:",
            adjustInventoryResponse.body.data.inventoryAdjustQuantity.userErrors
          );
        }
      }
    }

    return res.status(200).json({
      message: "Order synced successfully",
      order: {
        id: order.id,
        name: order.name,
        totalPrice: order.totalPriceSet.shopMoney.amount,
        currency: order.totalPriceSet.shopMoney.currencyCode,
      },
    });
  } catch (error) {
    console.error("Error syncing order:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while syncing the order" });
  }
};

export default withMiddleware("verifyProxy")(handler);
