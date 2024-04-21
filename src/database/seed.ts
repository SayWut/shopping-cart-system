import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const products: Prisma.ProductCreateInput[] = [
    {
        sku: 40389481,
        price: 10,
        quantity: 10,
        expirationDate: new Date()
    },
    {
        sku: 87660171,
        price: 30,
        quantity: 2,
        expirationDate: new Date()
    },
    {
        sku: 35622461,
        price: 10000,
        quantity: 5,
        expirationDate: new Date()
    },
    {
        sku: 99767581,
        price: 9.99,
        quantity: 6,
        expirationDate: new Date()
    }
]

async function main() {
    try {
        console.log("Start products");
        await prisma.product.createMany({ data: products });
        console.log("Finished seeding products (check your db).");
    }
    catch (err: any) {
        console.log("Elements already in database")
    }
}

export default main;