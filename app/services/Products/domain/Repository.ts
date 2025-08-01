import type { MethodsPagination } from "@/lib/types/services/Service";
import type { AllProducts, Category, Product } from "./Product";
import type { Request } from "@/lib/types/global/Global";

type OrderBy = 'asc' | 'desc' | null

interface OrderProduct {
    sellerPrice: OrderBy,
    cost: OrderBy,
    quantity: OrderBy,
    montCost: OrderBy,
    montSeller: OrderBy,
    createAt: OrderBy,
    updateAt: OrderBy
}


export type ProductOrderBy = Partial<Record<
    keyof Pick<Product, 'cost' | 'createAt' | 'updateAt' | 'quantity' | 'quantitySold' | 'totalSold' | 'totalCost' | 'salePrice' | 'id'>,
    OrderBy
>>
export type MethodsProducts = MethodsPagination<{ orderBy?: ProductOrderBy, search?: {name?: string, category?: string} }>
export type StateProduct = 'Inactivo' | 'Activo'

export interface Repository {
    setProducto(data: Product): Promise<Request<Product>>
    updateProducto(data: Partial<Product>): Promise<Request<Product>>
    getProducto(id: number): Promise<Request<Product>>
    deleteProducto(id: number): Promise<Request<Product>>
    getCategory(): Promise<Record<string, string>>
    getProductsInitial(methods: MethodsProducts): Promise<AllProducts['cursor']>
    getProducts(methods: MethodsProducts): Promise<AllProducts['products']>
    changeState(id: number, state: StateProduct): Promise<Request<Product>>
}