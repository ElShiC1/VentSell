import type { Aditional, MethodsPagination } from "@/lib/types/services/Service"
import type { AllClient, Client, ClientMore } from "./Client"
import type { Cursor, Request } from "@/lib/types/global/Global"


export type ClientOrderBy = {
    createAt?: 'asc' | 'desc',
    updateAt?: 'asc' | 'desc',
    id?: 'asc' | 'desc',
    orderUlt?: 'asc' | 'desc',
}
export type StateClient = 'Inactivo' | 'Activo' | 'Frecuente' | 'Prioritario'
export type MethodsClients = MethodsPagination<{ orderBy?: ClientOrderBy, search?: {fullname?: string, dni?: string, phone?: string, tipoID?: string, status?: number} }>

export interface Repository {
    postClient(data: Client): Promise<Request<ClientMore>>
    updateClient(data: Partial<Client>): Promise<Request<ClientMore>>
    getClient(id: number): Promise<Request<ClientMore>>
    deleteClient(id: number): Promise<Request<ClientMore>>
    getStatus(): Promise<Record<string, string>>
    getClientInitial(methods: MethodsClients): Promise<AllClient['cursor']>
    getClients(methods: MethodsClients): Promise<AllClient['clients']>
    changeState(id: number, state: StateClient): Promise<Request<ClientMore>>
}