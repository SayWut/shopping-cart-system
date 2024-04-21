import { JsonController, Param, Body, Get, Post, Put, Delete, OnUndefined, HttpCode } from 'routing-controllers';
import { AddProductBody, RemoveProductBody } from './validators';
import prisma from '../../database/prisma';

@JsonController("/:username/cart")
export class CartController {
    @Get('/')
    async cartContents(@Param("username") username: string) {
        return await prisma.cart.content(username);
    }

    @Post('/')
    @HttpCode(201)
    async addProduct(@Param("username") username: string, @Body({ validate: true }) product: AddProductBody) {
        return await prisma.cart.addItem(username, product.sku, product.quantity);
    }

    @Put('/')
    async updateProduct(@Param("username") username: string, @Body({ validate: true }) product: AddProductBody) {
        return await prisma.cart.updateItem(username, product.sku, product.quantity);
    }

    @Delete('/')
    async removeProduct(@Param("username") username: string, @Body({ validate: true }) product: RemoveProductBody) {
        return await prisma.cart.deleteItem(username, product.sku);
    }
}