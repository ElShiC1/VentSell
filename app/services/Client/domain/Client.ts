import type { Cursor } from "@/lib/types/global/Global"

export interface Client {
    id: number,
    dni?: string,
    fullname: string,
    phone?: string,
    status: number,
    createAt: string,
    updateAt: string,
    orderUlt: string,
    tipoID: 'CE' | 'DNI'
    totalCost: number,
    quantitySold: number,
    idorder: number
}

export type ClientMore = Client & { idorder: number, quantitySold: number, totalCost: number }


export interface AllClient {
    clients: ClientMore[]
    cursor: Cursor['cursor']
}

export class ClientDomain {
    constructor() { }

    getCursor({ totalClients, limit }: { totalClients: number, limit: number }, page: number): AllClient['cursor'] {
        const limitPage = Math.ceil(totalClients / limit)

        return {
            limit: limitPage,
            currentPage: page,
            next: page < limitPage
        }

    }

    getAllClients(data: Client[]): AllClient['clients'] {
        const datas = data.map((val) => ({
            ...val,
        }))

        return datas;
    }
}