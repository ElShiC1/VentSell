import type { Client } from "@/services/Client/domain/Client";
import { create } from "zustand";
import type { Item, Order, OrderId, OrderItem } from "../domain/Order";
import { VentSellDb } from "@/services/shared/VentSellDb";
import { ProductService } from "@/services/Products/infrastructure/ProductService";
import { db } from "../../db/Db";
import { validateData } from "@/lib/helpers/zodError";
import { OrderSchema } from "../domain/Schema";
import type { Request, SchemaError } from "@/lib/types/global/Global";
import type { Repository, StateOrder } from "../domain/Repository";
import { createRequestStore } from "@/lib/store/RequestStore";

interface OrderInterface {
    error: SchemaError<{ order: Partial<Order> }>,
    form: Partial<{
        data: Partial<Order & { idCl: number }>,
        orderItems: Partial<(Item & { state: 0 | 1 | 2 } & { subtotal: number } & { quantityID: number })[]>,
        deleteorderItems: Partial<(Item & { state: 0 | 1 | 2 } & { subtotal: number } & { quantityID: number })[]>,
        total: {
            totalSell: number,
            ship: number,
            quantityProducts: number,
            totalCost: number,
        }
    }>
    request: Request<Order>,
    open: boolean,
    orderItemsMethods: {
        addItems: (item: Pick<OrderItem, 'idProduct' | 'quantity' | 'salePrice'> & { state: number }) => void
        deleteItem: (id: number) => void
        setForm: (data: Partial<Order>) => Omit<Order, "idCL"> & { fullname: string; }
    }
    postForm: () => Promise<Omit<Order, "idCL"> & { name: string; phone: string; }>
    updateForm: () => Promise<Omit<Order, "idCL"> & { name: string; phone: string; }>
    changeState: (id: number, state: StateOrder) => Promise<Omit<Order, "idCL"> & { name: string; phone: string; }>
    getOrder: (id: number) => Promise<boolean>,
    openModal: (open: boolean) => void
}


const getProducto = new ProductService(db.product, db.category)
export const OrderStore = (repository: Repository) => create<OrderInterface>((set, get) => {
    const request = createRequestStore(set)
    return {
        form: {},
        open: false,
        error: {
            data: {},
            success: false
        },
        request: {
            loading: null,
            success: null,
            message: undefined,
            data: undefined
        },
        orderItemsMethods: {
            addItems: async (item) => {

                const { orderItems, data, deleteorderItems } = get().form

                const productResponse = await getProducto.getProducto(item.idProduct);

                if (!productResponse) {
                    console.error('Product not found');
                    return;
                }

                const { imgThumb, category, name, quantity, cost } = productResponse.data!;

                // 2. Update state immutably
                set((prev) => {
                    const existingIndex = prev.form.orderItems?.findIndex(
                        (val) => val.idProduct === item.idProduct
                    ) ?? -1;

                    // Create new array (immutable update)
                    let updatedOrderItems = [...(prev.form.orderItems ?? [])];
                    const validate = validateData(OrderSchema, { products: quantity > 0 ? [item, ...(orderItems ?? [])] : [...(orderItems ?? [])], order: { ...data } })

                    if (existingIndex >= 0) {
                        // Update existing item

                        const existingItem = updatedOrderItems[existingIndex];
                        const newQuantity = item.quantity < 1 ? 1 : item.quantity; // Mínimo 1 unidad
                        const maxAvailable = existingItem.quantity + existingItem.quantityID; // Máximo posible sin superar stock

                        // Determina la cantidad final (no excede el stock)
                        const finalQuantity = Math.min(newQuantity, maxAvailable);

                        updatedOrderItems[existingIndex] = {
                            ...existingItem,
                            imgThumb: imgThumb,
                            name: name,
                            category: category, // Spread all product data
                            quantity: finalQuantity,
                            subtotal: finalQuantity * item.salePrice,
                            state: existingItem.state,
                            realPrice: cost || 0,
                            quantityID: maxAvailable - finalQuantity
                        };
                        console.log(updatedOrderItems, 'updatedOrderItems existing', prev.form.orderItems, 'prev form orderItems')
                    } else {
                        // Add new item
                        const findItemDelete = deleteorderItems?.find((val) => val.idProduct === item.idProduct);

                        const canAdd = item.state === 1 || quantity > 0 || !!findItemDelete;

                        const existState = findItemDelete?.state ? 1 : item.state ?? 0;

                        updatedOrderItems = canAdd
                            ? [
                                {
                                    imgThumb,
                                    name,
                                    category,
                                    ...item,
                                    subtotal: item.quantity * item.salePrice,
                                    realPrice: cost || 0,
                                    state: existState,
                                    quantityID: !findItemDelete
                                        ? item.state === 1
                                            ? quantity
                                            : quantity - item.quantity
                                        : findItemDelete.quantityID + findItemDelete.quantity - item.quantity
                                },
                                ...updatedOrderItems
                            ]
                            : [...updatedOrderItems];
                        console.log(updatedOrderItems, 'updatedOrderItems')
                    }

                    return {
                        ...prev,
                        error: validate,
                        form: {
                            deleteorderItems: updatedOrderItems,
                            data: {
                                ...prev.form.data
                            },
                            orderItems: updatedOrderItems,
                            total: {
                                ...prev.form.total,
                                totalSell: updatedOrderItems.reduce((acc, num) => acc + num.subtotal, 0),
                                quantityProducts: updatedOrderItems.reduce((acc, num) => acc + num.quantity, 0),
                                totalCost: updatedOrderItems.reduce((acc, num) => acc + num.subtotal, 0) * (Number(prev.form.data?.igv ?? 0) / 100)
                            }
                        }
                    };
                });
            },
            deleteItem: (id) => {
                const { orderItems, data } = get().form


                set((prev) => {
                    const index = prev.form.orderItems?.findIndex(
                        (item) => item.idProduct === id
                    );

                    if (index === -1 || index === undefined) return prev;

                    const updatedOrderItems = [
                        ...prev.form.orderItems!.slice(0, index),
                        ...prev.form.orderItems!.slice(index + 1),
                    ];

                    const validate = validateData(OrderSchema, { products: updatedOrderItems, order: { ...data } })

                    return {
                        ...prev,
                        error: validate,
                        form: {
                            data: {
                                ...prev.form.data
                            },
                            deleteorderItems:
                                prev.form.orderItems![index].state === 1
                                    ? [
                                        { ...prev.form.orderItems![index], state: 2 },
                                        ...(prev.form.deleteorderItems ?? [])
                                    ]
                                    : [{ ...prev.form.orderItems![index], state: prev.form.orderItems![index].state },
                                    ...(prev.form.deleteorderItems ?? [])],
                            orderItems: updatedOrderItems,
                            total: {
                                ...prev.form.total,
                                quantityProducts: updatedOrderItems.reduce((acc, num) => acc + num.quantity, 0),
                                totalSell: prev.form.orderItems?.length! > 0 ? updatedOrderItems.reduce((acc, num) => acc + num?.subtotal, 0) + (Number(prev.form.data?.shipPrice ?? 0)) : (Number(prev.form.data?.shipPrice ?? 0)),
                                totalCost: updatedOrderItems.reduce((acc, num) => acc + num.subtotal, 0) * (Number(prev.form.data?.igv ?? 0) / 100)
                            }
                        },
                    };
                });
            },
            setForm: (dataForm) => {

                const { orderItems, data } = get().form
                console.log(dataForm, 'prubea store Order')
                const validate = validateData(OrderSchema, { products: orderItems, order: { ...data, ...dataForm } })
                console.log(validate, 'error validate')
                set((prev) => {

                    console.log((prev.form.total?.totalCost || 0) * (Number(dataForm?.igv ?? 0) / 100))

                    return {
                        ...prev,
                        error: validate,
                        form: {
                            data: {
                                ...prev.form.data,
                                ...dataForm
                            },
                            orderItems: prev.form.orderItems,
                            total: {
                                ...prev.form.total!,
                                ship: (Number(dataForm.shipPrice ?? prev.form.data?.shipPrice ?? 0)),
                                totalSell: prev.form.orderItems?.length! > 0 ? prev.form.orderItems?.reduce((acc, val) => acc + (val?.subtotal ?? 0), 0)! + (Number(dataForm.shipPrice ?? 0)) : (Number(dataForm.shipPrice ?? prev.form.data?.shipPrice ?? 0)),
                                totalCost: (((prev.form.total?.totalSell || 0) - (Number(dataForm.shipPrice ?? prev.form.data?.shipPrice ?? 0))) * (Number(dataForm?.igv ?? prev.form.data?.igv ?? 0) / 100))
                            }
                        }
                    }

                });
            }
        },
        changeState: async (id, state) => {
            try {
                set({
                    request: {
                        loading: true, success: false, message: {
                            text: 'Cambiando estado de la orden...',
                            type: 'loading',
                            animation: true
                        },
                    }
                });
                const result = await repository.changeState(id, state);
                set({ request: result })
                request.clearMessage()
                return result.data;
            } catch (error) {
                request.handleError(error, 'Error al cambiar el estado de la orden.')
                request.clearMessage()
            }
        },
        updateForm: async () => {
            try {
                set({
                    request: {
                        loading: true, success: false, message: {
                            text: 'Editando orden...',
                            type: 'loading',
                            animation: true
                        },
                    }, open: false
                });
                const { form, error } = get()
                if (!error.success) return;
                const data = form.data as Order & { idCl: number }
                const orderItems = form.orderItems?.map((val) => ({
                    idProduct: val?.idProduct,
                    quantity: val?.quantity,
                    salePrice: val?.salePrice,
                    realPrice: val?.realPrice || 0,
                    state: val?.state || 0
                })) || []
                const update = await repository.updateOrder(data, [...orderItems, ...(form.deleteorderItems?.length > 0 ? form.deleteorderItems?.filter((val) => val?.state === 2) : [])]);
                set({ request: update })
                get().openModal(false);
                request.clearMessage()
                return update.data;
            } catch (error) {
                request.handleError(error, 'Error al editar orden.')
                request.clearMessage()
            }

        },
        postForm: async () => {
            try {
                set({
                    request: {
                        loading: true, success: false, message: {
                            text: 'Creando orden...',
                            type: 'loading',
                            animation: true
                        },
                    }, open: false
                });
                const data = get().form
                const orderItems = data.orderItems?.map((val) => ({
                    idProduct: val?.idProduct,
                    quantity: val?.quantity,
                    salePrice: val?.salePrice,
                    realPrice: val?.realPrice || 0
                }))
                const result = await repository.postOrder(data.data, orderItems, data.data?.idCl)
                set({ request: result })
                get().openModal(false);
                request.clearMessage()
                return result.data;
            } catch (error) {
                request.handleError(error, 'Error al registar orden.')
                request.clearMessage()
            }

        },
        getOrder: async (id) => {
            try {
                const addItems = get().orderItemsMethods
                const order = await repository.getOrderId(id)

                if (!order.data) {
                    set({
                        request: {
                            loading: true, success: false, message: {
                                text: 'Orden no encontrada.',
                                type: 'error',
                                animation: true
                            },
                        }, open: false
                    });
                    request.clearMessage()
                    return false;
                }

                if (order.data.order.status === 5) {
                    set({
                        request: {
                            loading: true, success: false, message: {
                                text: 'Orden cancelado no se puede editar.',
                                type: 'error',
                                animation: true
                            },
                        }, open: false
                    });
                    request.clearMessage()
                    return false;
                }

                


                set((prev) => ({
                    ...prev,
                    form: {
                        ...prev.form,
                        data: {
                            ...order.data?.order,
                            payment: order.data?.order.payment,
                        },
                    }
                }))

                order.data?.products?.forEach((val) => {
                    addItems.addItems({
                        idProduct: val.idProduct,
                        quantity: val.quantity,
                        salePrice: val.salePrice,
                        state: 1,
                    });
                });
                return true

            } catch (error) {
                console.log(error, 'no tengo ni idea si funciona')
                return false
            }
        },
        openModal: (open) => {
            if (!open) {
                set((val) => ({
                    open: open, form: {}
                }))
                return;
            }
            set({ open });
        }
    }
})