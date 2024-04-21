import { JsonController, Body, Post, Res, OnUndefined } from 'routing-controllers';
import { CreateProductBody } from './validators';
import { Response } from 'express';
import prisma from '../../database/prisma';

@JsonController("/product")
export class ProductController {
    @Post('/')
    @OnUndefined(201)
    async createProduct(@Body() product: CreateProductBody, @Res() res: Response) {
        try {
            await prisma.product.create({
                data: {
                    sku: product.sku,
                    quantity: product.quantity,
                    price: product.price,
                    expirationDate: new Date(product.expirationDate)
                }
            })

            return;
        }
        catch (err: any) {
            console.log(err)
            res.status(409);
        }

        return res.send();
    }
}