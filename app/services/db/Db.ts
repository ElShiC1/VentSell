import Dexie, { type EntityTable } from "dexie";
import type { Category, Product } from "../Products/domain/Product";
import type { Order, OrderItem } from "../Order/domain/Order";
import type { Client } from "../Client/domain/Client";

export interface TableVentSell {
    product: EntityTable<Product>
    category: EntityTable<Category>
    orderItem: EntityTable<OrderItem>
    order: EntityTable<Order>
    client: EntityTable<Client>
}

export const db = new Dexie('VentSell') as Dexie & TableVentSell
db.version(1).stores({
    orderItem: '++id, idOrder, idProduct, quantity, salePrice',
    order: '++id, idCl, ubigeoCode, status, igv, shipPrice, shiptype, quantityTotal ,address,note ,createAt, updateAt, costTotal, totalSold, courier, payment,[updateAt+createAt]',
    client: '++id, tipoID ,dni, fullname, phone, status, createAt, updateAt, orderUlt ,[updateAt+createAt+orderUlt], totalCost, quantitySold, idorder',
    product: '++id, img, imgThumb, name, description,category ,cost, totalCost, totalSold ,salePrice, quantitySold ,quantity,updateAt,createAt,status,[updateAt+createAt]',
    category: '++id, name, count ,createAt, updateAt'
})

export async function exportDatabase() {
    const exportData: Record<string, unknown[]> = {};

    for (const table of db.tables) {
        const rows = await table.toArray();
        exportData[table.name] = rows;
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${db.name}-backup.json`;
    a.click();
    URL.revokeObjectURL(url);

}

export async function importDatabase(jsonData: Record<string, unknown[]>) {
    for (const table of db.tables) {
        const data = jsonData[table.name];
        if (Array.isArray(data)) {
            await db.transaction("rw", table, async () => {
                await table.clear(); // Limpia antes de importar
                await table.bulkAdd(data);
            });
        }
    }
        window.location.reload();
}

export async function deleteDatabase() {
    await db.delete();
    window.location.reload();
}