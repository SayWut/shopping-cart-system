import { PrismaClient } from '@prisma/client'
import businessLogic from './businessLogic';

const prisma = new PrismaClient().$extends({
    model: {
        cart: {
            addItem: businessLogic.addCartItem,
            updateItem: businessLogic.updateCartItem,
            deleteItem: businessLogic.deleteCartItem,
            content: businessLogic.getCartContent
        }
    }
});

export default prisma;