import type { Aditional, MethodsPagination } from "@/lib/types/services/Service"
import type { Repository } from "./Repository"

export interface Product {
    id: number,
    img?: File | string,
    imgThumb?: File | string,
    name: string,
    category: string,
    description: string,
    cost?: number,
    quantitySold: number,
    salePrice: number,
    totalCost: number,
    totalSold: number
    quantity: number,
    status: number,
    createAt: string,
    updateAt?: string
}

export interface Category {
    id?: number,
    name: string,
    createAt: string,
    count: number,
    updateAt?: string
}

export interface AllProducts {
    products: Product[],
    cursor: {
        limit: number
        currentPage: number,
        next: boolean
    }
}

export class ProductClass {

    constructor() { }

    getCursor({ totalProducts, limit }: { totalProducts: number, limit: number }, page: number): AllProducts['cursor'] {
        const limitPage = Math.ceil(totalProducts / limit)

        return {
            limit: limitPage,
            currentPage: page,
            next: page < limitPage
        }

    }

    getAllProducts(data: Product[]): AllProducts['products'] {
        return data
    }
}