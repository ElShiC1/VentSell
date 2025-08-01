import { ClientRepository } from "../Client/application/ClientRepository";
import { ClientService } from "../Client/infrastructure/ClientService";
import { StoreClient } from "../Client/store/Store";
import { ClientStoreGet } from "../Client/store/StoreClientGet";
import { db } from "../db/Db";
import { OrderRepository } from "../Order/application/OrderRepository";
import { OrderService } from "../Order/infrastructure/OrderService";
import { OrderStore } from "../Order/store/Store";
import { OrderGetStore } from "../Order/store/StoreGet";
import { ProductRepository } from "../Products/application/ProductRepository";
import { ProductService } from "../Products/infrastructure/ProductService";
import { ProductStore } from "../Products/store/Store";
import { ProductGetStore } from "../Products/store/StoreGet";

export const VentSellDb = {
    Product: {
        ProductMethods: ProductStore(ProductRepository(new ProductService(db.product, db.category, db.orderItem))),
        ProductGetMethods: ProductGetStore(ProductRepository(new ProductService(db.product, db.category, db.orderItem)))
    },
    Client: {
        ClientMethods: StoreClient(ClientRepository(new ClientService(db.client, db.order))),
        ClienGetMethods: ClientStoreGet(ClientRepository(new ClientService(db.client, db.order)))
    },
    Order: {
        OrderMethods: OrderStore(OrderRepository(new OrderService(db))),
        OrderGetMethods: OrderGetStore(OrderRepository(new OrderService(db))),
    }
}