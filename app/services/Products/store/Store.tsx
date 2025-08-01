import { create } from "zustand";
import type { AllProducts, Product as ProductForm } from "../domain/Product";
import type { Request, SchemaError } from "@/lib/types/global/Global";
import type { Repository, StateProduct } from "../domain/Repository";
import { ConverNum } from "@/lib/utils/NumberVal";
import type { data } from "react-router";
import { validateData } from "@/lib/helpers/zodError";
import { SchemaProduct } from "../domain/Schema";
import { createRequestStore } from "@/lib/store/RequestStore";

interface Product {
    form: Partial<ProductForm> & { costotal?: string, profittotal?: string, margin?: string, profitreal?: string },
    open: boolean,
    request: Request<ProductForm>,
    error: SchemaError<ProductForm & { costotal?: string, profittotal?: string, margin?: string, profitreal?: string }>,
    setForm: (data: Partial<ProductForm> & { costotal?: string, profittotal?: string, margin?: string, profitreal?: string }) => void
    postForm: () => Promise<ProductForm | undefined>
    openModal: (open: boolean) => void
    deleteProducto: (id: number) => Promise<void>
    getProducto: (id: number) => Promise<false | Request<ProductForm>>
    updateForm: () => Promise<ProductForm | undefined>
    changeState: (id: number, state: StateProduct) => Promise<ProductForm | undefined>
}



export const ProductStore = (repository: Repository) => create<Product>((set, get) => {
    const request = createRequestStore(set)
    console.log('cuantas veces se ejecuta esto weon')

    return {
        open: false,
        form: {
            id: undefined,
            name: undefined,
            category: undefined,
            cost: undefined,
            description: undefined,
            salePrice: undefined,
            quantity: undefined,
            status: undefined,
            createAt: undefined,
            updateAt: undefined,
            profitreal: undefined,
            costotal: undefined,
            profittotal: undefined,
            margin: undefined,
            img: undefined,
        },
        edit: {

        },
        request: {
            loading: null,
            success: null,
            message: undefined,
            data: undefined
        },
        error: {
            data: {},
            success: false
        },
        changeState: async (id, state) => {
            try {
                const result = await repository.changeState(id, state)
                set({ request: result })
                request.clearMessage()
                return result.data
            } catch (error) {
                request.handleError(error, 'Error al actualizar el estado.')
                request.clearMessage()
            }
        },
        setForm: (data) => {
            const state = get();
            const errorValidate = validateData(SchemaProduct, state.form);
            console.log(errorValidate, "Error Validate");

            // Guarda los valores como string para permitir puntos decimales
            let cost = data.cost ?? state.form.cost ?? "0";
            const salePriceInput = data.salePrice ?? state.form.salePrice ?? "0";
            let margin = data.margin ?? state.form.margin ?? "0";
            let finalSalePrice = salePriceInput;

            const costNum = Number(cost);
            const salePriceNum = Number(salePriceInput);

            // Si el usuario está cambiando el margen, recalcula el salePrice
            if (data.margin !== undefined && data.margin !== "") {
                if (!isNaN(Number(margin)) && costNum > 0) {
                    finalSalePrice = (costNum + (costNum * (Number(margin) / 100))).toFixed(2);
                }
            }
            // Si el usuario está cambiando el cost, recalcula el salePrice y el margen
            else if (data.cost !== undefined && costNum > 0 && salePriceNum > 0) {
                finalSalePrice = salePriceNum.toFixed(2);
                margin = (((salePriceNum - costNum) / costNum) * 100).toFixed(2);
            }
            // Si el usuario está cambiando el salePrice, recalcula el margen
            else if (data.salePrice !== undefined && costNum > 0 && salePriceNum > 0) {
                margin = (((salePriceNum - costNum) / costNum) * 100).toFixed(2);
            }



            const quantity = data.quantity ?? state.form.quantity ?? "";

            set({
                error: !errorValidate.success
                    ? errorValidate
                    : { success: true, data: {} },
                form: {
                    ...state.form,
                    ...data,
                    cost: cost as number,
                    salePrice: finalSalePrice as number,
                    margin,
                    quantity: quantity as number,
                    costotal: (costNum && quantity) ? `${costNum * Number(quantity)}` : "0",
                    profitreal: (salePriceNum && costNum && quantity) ? `${((salePriceNum - costNum) * Number(quantity)).toFixed(2)}` : "0",
                    profittotal: (salePriceNum && quantity) ? `${(salePriceNum * Number(quantity)).toFixed(2)}` : "0",
                }
            });
        },
        postForm: async () => {
            try {
                set({
                    request: {
                        loading: true, success: false, message: {
                            text: 'Creando producto...',
                            type: 'loading',
                            animation: true
                        },
                    }, open: false
                });
                const { profitreal, profittotal, margin, costotal, salePrice, cost, quantity, ...data } = get().form;
                const resultProduct = await repository.setProducto({ salePrice: Number(salePrice!), cost: Number(cost!), quantity: Number(quantity!), ...data } as ProductForm);
                set({ request: resultProduct })

                request.clearMessage()
                // ...existing code...
                return resultProduct.data
            } catch (error) {
                request.handleError(error, 'Error al crear producto.')
                request.clearMessage()
            }
        },
        updateForm: async () => {
            try {
                set({
                    request: {
                        loading: true, success: false, message: {
                            text: 'Editando producto...',
                            type: 'loading',
                            animation: true
                        },
                    }, open: false
                });
                const { profitreal, profittotal, createAt, updateAt, margin, costotal, salePrice, cost, quantity, ...data } = get().form;
                const updateData = await repository.updateProducto({ quantity: Number(quantity!), salePrice: Number(salePrice!), cost: Number(cost!), ...data } as ProductForm);
                set({ request: updateData })

                request.clearMessage()
                return updateData.data
            } catch (error) {
                request.handleError(error, 'Error al actualizar producto.')
                request.clearMessage()
            }
        },
        getProducto: async (id: number) => {
            try {

                const getProducto = await repository.getProducto(id)

                set({
                    form: {
                        margin: (((getProducto.data?.salePrice! - getProducto.data?.cost!) / getProducto.data?.cost!) * 100).toFixed(2),
                        costotal: (getProducto.data?.cost && getProducto.data.quantity) ? `${getProducto.data.cost * Number(getProducto.data.quantity)}` : "0",
                        profitreal: (getProducto.data?.salePrice && getProducto.data.cost && getProducto.data.quantity) ? `${((getProducto.data.salePrice - getProducto.data.cost) * Number(getProducto.data.quantity)).toFixed(2)}` : "0",
                        profittotal: (getProducto.data?.salePrice && getProducto.data.quantity) ? `${(getProducto.data?.salePrice * Number(getProducto.data.quantity)).toFixed(2)}` : "0",
                        ...getProducto.data
                    }
                })
                return getProducto
            } catch (error) {
                return false
            }
        },
        deleteProducto: async (id: number) => {
            try {

                const confirm = window.confirm(`¿Eliminar el producto con el id ${id}?`)

                if (!confirm) return;

                const res = await repository.deleteProducto(id)
                set({ request: res })

                request.clearMessage();
            } catch (error) {
                const request = createRequestStore(set)
                request.handleError(error, 'Error al eliminar producto.')
                request.clearMessage();
            }
        },
        openModal: (open: boolean) => {
            if (!open) {
                set({
                    open,
                    form: {
                        id: undefined,
                        name: undefined,
                        category: undefined,
                        cost: undefined,
                        description: undefined,
                        salePrice: undefined,
                        quantity: undefined,
                        status: undefined,
                        createAt: undefined,
                        updateAt: undefined,
                        profitreal: undefined,
                        costotal: undefined,
                        profittotal: undefined,
                        margin: undefined,
                        img: undefined,
                    }
                });
            } else {
                set({ open });
            }
        }
    }
}
)


