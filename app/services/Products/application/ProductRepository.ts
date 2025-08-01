import type { MethodsPagination } from "@/lib/types/services/Service";
import type { Product, AllProducts } from "../domain/Product";
import type { MethodsProducts, Repository, StateProduct } from "../domain/Repository";
import { resizeAndConvertToBase64Low, resizeAndConvertToBase64High } from "@/lib/utils/ConverImage";
import type { data } from "react-router";

export const ProductRepository = (Repository: Repository) => ({
    setProducto: async ({ img, ...data }: Product) => {
        return Repository.setProducto({ img: img ? await resizeAndConvertToBase64High(img as File) : undefined, imgThumb: img ? await resizeAndConvertToBase64Low(img as File) : undefined, ...data })
    },
    getProductsInitial: function (methods: MethodsProducts) {
        return Repository.getProductsInitial(methods)
    },
    getProducts: function (methods: MethodsProducts) {
        return Repository.getProducts(methods)
    },
    getProducto: function (id: number) {
        return Repository.getProducto(id)
    },
    updateProducto: async ({ img, imgThumb, ...data }: Partial<Product>) => {
        console.log(data, "Data to update product Service");
        return Repository.updateProducto({ img: img instanceof File ? await resizeAndConvertToBase64High(img) : img, imgThumb: img instanceof File ? await resizeAndConvertToBase64Low(img as File) : imgThumb, ...data })
    },
    deleteProducto: function (id: number) {
        return Repository.deleteProducto(id)
    },
    changeState: (id: number, state: StateProduct) => {
        return Repository.changeState(id, state)
    },
    getCategory: () => {
        return Repository.getCategory()
    }
})