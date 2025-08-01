import type { Request } from "@/lib/types/global/Global";
import type { Client } from "@/services/Client/domain/Client";
import type { Order, OrderItem, OrderId, OrderAll, Analytics } from "../domain/Order";
import type { MethodsOrder, Repository, StateOrder } from "../domain/Repository";

export const OrderRepository = (repository: Repository) => ({
    postOrder: async function (data: Order, orderItems: OrderItem[], idCL: number): Promise<Request<Omit<Order, "idCL"> & { fullname: string; }>> {
        return await repository.postOrder(data, orderItems, idCL)
    },
    updateOrder: async function (data: Order, orderItems: (OrderItem & { state: 0 | 1 | 2, realPrice: number })[]): Promise<Request<Omit<Order, "idCL"> & { fullname: string; }>> {
        return await repository.updateOrder(data, orderItems)
    },
    getOrderId: async function (id: number): Promise<Request<OrderId>> {
        return await repository.getOrderId(id)
    },
    getOrderAll: async function (methods: MethodsOrder): Promise<OrderAll["order"]> {
        return await repository.getOrderAll(methods)
    },
    getOrderCursor: async function (methods: MethodsOrder): Promise<OrderAll["cursor"]> {
        return await repository.getOrderCursor(methods) 
    },
    changeState: async function (id: number, state: StateOrder): Promise<Request<Omit<Order, "idCL"> & { name: string; phone: string; }>> {
        return await repository.changeState(id, state)
    },
    getAnalytics(): Promise<Analytics> {
        return repository.getAnalytics()
    }
})