import "reflect-metadata";
import express from "express";
import { useExpressServer } from 'routing-controllers';
import { ProductController } from "./controllers/productController/ProductController";
import { CartController } from "./controllers/cartController/CartController";
import seedDB from "./database/seed";

// seeds the DB
seedDB();

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

useExpressServer(app, {
    routePrefix: "/api/v1",
    controllers: [ProductController, CartController]
});

app.listen(3000, () => {
    console.log("listening on port 3000")
})