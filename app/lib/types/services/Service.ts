import type { Product } from "@/services/Products/domain/Product"

export interface MethodsPagination<T extends Record<string, any>>{
    page: number,
    filter?: T
}

export type Aditional<T, K extends Record<string, any>> = T & K