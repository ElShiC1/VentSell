import type { Request } from "@/lib/types/global/Global"
import type { Order, OrderAll, OrderId, OrderItem } from "./Order"
import type { Client } from "@/services/Client/domain/Client"
import type { MethodsPagination } from "@/lib/types/services/Service"

type OrderBy = 'asc' | 'desc' | undefined

export interface OrderOrderBy {
    totalSold?: OrderBy,
    costTotal?: OrderBy,
    createAt?: OrderBy,
    updateAt?: OrderBy,
    id?: OrderBy,
}

export interface Repository {
        postOrder(data: Order, orderItems: OrderItem[], idCL: number): Promise<Request<Omit<Order, "idCL"> & { name: string; phone: string; }>>
        updateOrder(data: Order, orderItems:( OrderItem & { state: 0 | 1 | 2 })[]): Promise<Request<Omit<Order, "idCL"> & { name: string; phone: string; }>>
        getOrderId(id: number): Promise<Request<OrderId>>
        getOrderAll(methods: MethodsOrder): Promise<OrderAll['order']>
        getOrderCursor(methods: MethodsOrder): Promise<OrderAll['cursor']>
        changeState(id: number, state: StateOrder): Promise<Request<Omit<Order, "idCL"> & { name: string; phone: string; }>>
} 



export type MethodsOrder = MethodsPagination<{ orderBy?: OrderOrderBy, search?: {fullname?: string, dni?: string, ubigeoCode?: string, id?: number, phone?: string}}>
export type StateOrder = 'Pendiente' | 'Confirmado' | 'Preparando' | 'Enviado' | 'Entregado' | 'Cancelado'
