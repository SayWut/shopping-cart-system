import { Prisma } from '@prisma/client'
import prisma from "./prisma";

/**
 * Adds a new item to the user's cart, ensuring product availability and updating stock.
 *
 * This function attempts to add an item to the user's cart using a Prisma transaction. 
 * It performs the following actions:
 *
 * 1. Checks if the product with the provided `productSku` exists and has sufficient stock
 * 2. If the product exists and has enough stock:
 *    - Creates a new `CartItem` instance with the specified `quantity` and connects it to the user's cart (creating the cart if it doesn't exist).
 *    - Updates the product's quantity by decrementing it with the added `quantity`.
 * 3. If the product doesn't exist or doesn't have enough stock, an error will be thrown within the transaction (handled at a higher level).
 *
 * @param {string} username - The username of the user adding the item to the cart.
 * @param {number} productSku - The unique SKU identifier of the product to add.
 * @param {number} quantity - The desired quantity of the product to add.
 * @throws {Error} - If the product is not found or doesn't have enough stock.
 */
async function addCartItem(username: string, productSku: number, quantity: number): Promise<Prisma.CartItemGetPayload<{}>> {
    return await prisma.$transaction(async (tx) => {
        const addedItem = await tx.cartItem.create({
            data: {
                quantity: quantity,
                Cart: {
                    connectOrCreate: {
                        // creates a new Cart instance if not exists
                        create: {
                            username
                        },
                        // checks the user has a Cart instance
                        where: {
                            username
                        }
                    }
                },
                Product: {
                    // checks if the product exists and has sufficient stock
                    connect: {
                        sku: productSku,
                        quantity: {
                            gte: quantity
                        }
                    },
                }
            }
        });

        // updates the product stock
        await tx.product.update({
            where: {
                sku: addedItem.productSku
            },
            data: {
                quantity: {
                    decrement: addedItem.quantity
                }
            }
        })

        return addedItem;
    });
}

/**
 * Updates the quantity of an existing item in the user's cart, ensuring product availability for quantity increases.
 *
 * This function atomically update a user's cart item and the corresponding product stock. 
 * It verifies product existence and throws an error if not found. It then locates the specific cart item and throws another error if missing. 
 * The function validates the update based on the desired quantity change: reducing the cart quantity is always allowed, while increasing it requires sufficient product stock. 
 * If valid, it updates both the cart item's quantity and the product stock accordingly before returning the updated cart item.
 *
 * @param {string} username - The username of the user whose cart item to update.
 * @param {number} productSku - The unique SKU identifier of the product to update.
 * @param {number} quantity - The desired new quantity for the product in the cart.
 * @throws {Error} - If the product is not found, cart item is not found, or there's not enough stock for increasing the quantity.
 */
async function updateCartItem(username: string, productSku: number, quantity: number): Promise<Prisma.CartItemGetPayload<{}>> {
    return await prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
            where: {
                sku: productSku
            }
        });

        if (!product) {
            throw new Error("Product not found");
        }

        const cartItem = await tx.cartItem.findUniqueOrThrow({
            where: {
                cartItemId: {
                    cartUsername: username,
                    productSku
                }
            }
        });

        if (!cartItem) {
            throw new Error("Cart item not found");
        }

        // Calculate the difference between desired and existing cart quantity
        const cartQuantityDelta = cartItem.quantity - quantity;
        if (cartQuantityDelta == 0) {
            return cartItem;
        }

        // Check if the update is valid based on quantity changes
        const isUpdate = cartQuantityDelta > 0 || (cartQuantityDelta < 0 && product.quantity >= Math.abs(cartQuantityDelta));

        // Explain the logic behind the `isUpdate` check
        /**
         * The `isUpdate` variable determines if adding the desired quantity to the cart is a valid update.
         * We consider two scenarios:
         *   1. Positive difference (diff > 0):
         *      This indicates the customer wants to **reduce** the quantity in the cart. The update is valid regardless of product stock.
         *   2. Negative difference (diff < 0):
         *      This indicates the customer wants to **increase** the quantity in the cart. The update is only valid if there's enough product stock to fulfill the increase. We use `Math.abs(diff)` to get the absolute value of the difference (desired quantity increase).
         */

        if (!isUpdate) {
            throw new Error("Not enough in stock");
        }

        const updatedItem = await tx.cartItem.update({
            where: {
                cartItemId: {
                    productSku,
                    cartUsername: username
                },
            },
            data: {
                quantity
            }
        });

        await tx.product.update({
            where: {
                sku: productSku
            },
            data: {
                quantity: {
                    increment: cartQuantityDelta
                }
            }
        })

        return updatedItem;
    });
}

/**
 * Removes an item from the user's cart and updates the corresponding product stock.
 *
 * This function utilizes a Prisma transaction to atomically delete a cart item and adjust the product stock. 
 * It locates the specific cart item for the user and `productSku` and throws an error if not found. 
 * The function then deletes the cart item and updates the product's quantity by incrementing it with the deleted item's quantity (effectively returning the stock to the product). 
 * Finally, it returns the deleted cart item.
 *
 * @param {string} username - The username of the user whose cart item to delete.
 * @param {number} productSku - The unique SKU identifier of the product to remove from the cart.
 * @throws {Error} - If the cart item is not found.
 */
async function deleteCartItem(username: string, productSku: number): Promise<Prisma.CartItemGetPayload<{}>> {
    return await prisma.$transaction(async (tx) => {
        const deletedItem = await tx.cartItem.delete({
            where: {
                cartItemId: {
                    cartUsername: username,
                    productSku: productSku
                }
            }
        })

        await tx.product.update({
            where: {
                sku: productSku
            },
            data: {
                quantity: {
                    increment: deletedItem.quantity
                }
            }
        })

        return deletedItem;
    });
}

async function getCartContent(username: string) {
    const cartItems = await prisma.cartItem.findMany({
        select: {
            Product: true
        },
        where: {
            Cart: {
                username: username
            }
        }
    });

    return cartItems;
}


export default {
    addCartItem,
    updateCartItem,
    deleteCartItem,
    getCartContent
}