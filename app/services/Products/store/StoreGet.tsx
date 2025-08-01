import { create } from "zustand";
import type { AllProducts, Product as ProductForm } from "../domain/Product";
import type { Request, SchemaError } from "@/lib/types/global/Global";
import type { MethodsProducts, Repository } from "../domain/Repository";

interface Product {
    request: Request<ProductForm>,
    products: AllProducts['products'],
    selects: {
        category: Record<string, string>
    }
    error: SchemaError<ProductForm & { costotal?: string, profittotal?: string, margin?: string, profitreal?: string }>,
    cursor: AllProducts['cursor'] | null,
    filter: MethodsProducts['filter'],
    getCategory: () => void
    addProduct: (data: ProductForm) => void,
    getProducts: (methods: MethodsProducts) => Promise<void>,
    getProductsInitial: (methods: MethodsProducts) => Promise<void>
}



export const ProductGetStore = (repository: Repository) => create<Product>((set, get) => ({
    request: {
        loading: null,
        success: null,
        message: undefined,
        data: undefined
    },
    selects: {
        category: {}
    },
    filter: {
        orderBy: {}
    },
    cursor: null,
    products: [],
    error: {
        data: {},
        success: false
    },
    addProduct: (data: ProductForm) => {
        set((state) => {
            const existingIndex = state.products.findIndex(p => p.id === data.id);
            console.log(existingIndex, "Existing Index");
            const newProduct = { ...data };
            let products;
            if (existingIndex !== -1) {
                products = [
                    newProduct,
                    ...state.products.slice(0, existingIndex),
                    ...state.products.slice(existingIndex + 1)
                ];
            } else {
                products = [
                    newProduct,
                    ...(state.products.length === 11 ? state.products.slice(0, -1) : state.products)
                ];
            }
            return { products };
        });
    },
    getProducts: async (methods) => {
        console.log(methods, 'xddd')
        const data = await repository.getProducts(methods);
        console.log(get().filter, "Data from getProducts");
        set(({ products: [...data], filter: { orderBy: methods.filter?.orderBy ?? {}, search: methods.filter?.search ?? {} } }))
    },
    getCategory: async () => {
        const categorys = await repository.getCategory()
        set({ selects: { category: categorys } })
    },
    getProductsInitial: async (methods) => {
        const getMethods = get()

        if (getMethods.cursor && getMethods.cursor.currentPage !== methods.page && !methods.filter?.search?.category && !methods.filter?.search?.name) {
            const { currentPage, ...data } = getMethods.cursor
            console.log('Using cached cursor')
            set(({ cursor: { currentPage: methods.page, ...data } }));
            return;
        }

        const data = await repository.getProductsInitial(methods);
        console.log(data, "Data from getProductsInitial");
        set(({ cursor: data, filter: { orderBy: methods.filter?.orderBy ?? {}, search: methods.filter?.search ?? {} } }));
    }
}))


