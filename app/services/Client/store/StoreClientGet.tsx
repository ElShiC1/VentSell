import { create } from "zustand";
import type { MethodsClients, Repository } from "../domain/Repository";
import type { AllClient, ClientMore } from "../domain/Client";
import type { Request, SchemaError } from "@/lib/types/global/Global";

interface ClientStoreGet {
    clients: AllClient['clients'],
    selects?: {
        category: {
            DNI: null,
            CE: null
        }
    }
    cursor: AllClient['cursor'] | null,
    filter: MethodsClients['filter'],
    addClient: (data: ClientMore) => void,
    getClients: (methods: MethodsClients) => Promise<void>,
    getClientsInitial: (methods: MethodsClients) => Promise<void>
}


export const ClientStoreGet = (repository: Repository) => create<ClientStoreGet>((set, get) => ({
    clients: [],
    cursor: null,
    filter: {
        orderBy: {}
    },
    addClient: (data) => {
        const {getClientsInitial, clients: clientsGet, cursor} = get()


        set((state) => {
            const existingIndex = state.clients.findIndex(p => p.id === data.id);
            console.log(existingIndex, "Existing Index");
            const newProduct = { ...data };

            if(clientsGet.length === 11){
                getClientsInitial({page: cursor?.currentPage || 1})
            }

            let clients;
            if (existingIndex !== -1) {
                clients = [
                    newProduct,
                    ...state.clients.slice(0, existingIndex),
                    ...state.clients.slice(existingIndex + 1)
                ];
            } else {
                clients = [
                    newProduct,
                    ...(state.clients.length === 11 ? state.clients.slice(0, -1) : state.clients)
                ];
            }
            return { clients };
        });
    },
    getClients: async (methods) => {
        console.log(methods, 'xddd')
        const data = await repository.getClients(methods);
        console.log(get().filter, "Data from getProducts");
        set(({ clients: [...data], filter: { orderBy: methods.filter?.orderBy ?? {}, search: methods.filter?.search ?? {} } }))
    },
    getClientsInitial: async (methods) => {
        const getMethods = get()

        if (getMethods.cursor && getMethods.cursor.currentPage !== methods.page && !methods.filter?.search?.dni && !methods.filter?.search?.fullname && !methods.filter?.search?.phone) {
            const { currentPage, ...data } = getMethods.cursor
            console.log('Using cached cursor')
            set(({ cursor: { currentPage: methods.page, ...data } }));
            return;
        }

        const data = await repository.getClientInitial(methods);
        console.log(data, 'funciona el cursor de clients')
        console.log(data, "Data from getProductsInitial");
        set(({ cursor: data, filter: { orderBy: methods.filter?.orderBy ?? {}, search: methods.filter?.search ?? {} } }));
    }


}))